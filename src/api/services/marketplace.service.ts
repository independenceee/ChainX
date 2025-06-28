import { deserializeAddress, mConStr0, stringToHex, PolicyId, CIP68_222 } from "@meshsdk/core";
import { MarketplaceAdapter } from "../adapters/marketplace.adapter";
import { appNetwork, PLATFORM_ADDRESS, PLATFORM_TOKEN } from "@/contracts/constants";

export class MarketplaceService extends MarketplaceAdapter {
  /**
   * @action Mint
   * @description The method is used to mint a new asset on the ChainX Blockchain
   *
   * @param assetName - The name of the asset to minted
   * @param quantity - The quantity of the asset to be minted
   * @param walletAddress - The address is used to mint a new asset on the ChainX Blockchain
   *
   * @returns unsignedTx - Returns a promise that resolves to the unsigned transaction string
   */
  mint = async ({
    assetName = "Chain X",
    quantity,
    walletAddress,
  }: {
    assetName: string;
    quantity: string;
    walletAddress: string;
  }): Promise<string> => {
    const { utxos, collateral } = await this.getWalletForTx({ walletAddress: PLATFORM_ADDRESS });
    const unsignedTx = this.meshTxBuilder
      .mintPlutusScript("V3")
      .mint(quantity, this.policyId, stringToHex(assetName))
      .mintingScript(this.mintScriptCbor)
      .mintRedeemerValue(mConStr0([]))

      .txOut(this.marketplaceAddress, [
        {
          unit: this.policyId + stringToHex(assetName),
          quantity: quantity,
        },
      ])

      .changeAddress(walletAddress)
      .requiredSignerHash(deserializeAddress(PLATFORM_ADDRESS).pubKeyHash)
      .selectUtxosFrom(utxos)
      .txInCollateral(
        collateral.input.txHash,
        collateral.input.outputIndex,
        collateral.output.amount,
        collateral.output.address,
      )
      .setNetwork(appNetwork);
    return await unsignedTx.complete();
  };

  /**
   * @action Burn
   * @description The method is used to burn a new asset on the ChainX Blockchain
   *
   * @param assetName - The name of the asset to burned
   * @param quantity - The quantity of the asset to be burned
   * @param walletAddress - The address is used to burn a new asset on the ChainX Blockchain
   *
   * @returns unsignedTx - Returns a promise that resolves to the unsigned transaction string
   */
  burn = async ({
    assetName,
    quantity,
    walletAddress,
  }: {
    assetName: string;
    quantity: string;
    walletAddress: string;
  }): Promise<string> => {
    const { utxos, collateral } = await this.getWalletForTx({ walletAddress: PLATFORM_ADDRESS });
    const utxo = await this.getAddressUTXOAsset(walletAddress, this.policyId + stringToHex(assetName));
    const lovelace = this.getUtxoOnlyLovelace({ utxos: [utxo], unit: "lovelace", quantity: "0" });
    const unsignedTx = this.meshTxBuilder
      .txIn(utxo.input.txHash, utxo.input.outputIndex)

      .mintPlutusScript("V3")
      .mint(quantity, this.policyId, stringToHex(assetName))
      .mintingScript(this.mintScriptCbor)
      .mintRedeemerValue(mConStr0([]))

      .txOut(walletAddress, [
        {
          unit: "lovelace",
          quantity: String(lovelace),
        },
      ])

      .changeAddress(walletAddress)
      .requiredSignerHash(deserializeAddress(PLATFORM_ADDRESS).pubKeyHash)
      .selectUtxosFrom(utxos)
      .txInCollateral(
        collateral.input.txHash,
        collateral.input.outputIndex,
        collateral.output.amount,
        collateral.output.address,
      )
      .setNetwork(appNetwork);
    return await unsignedTx.complete();
  };

  /**
   * @action Sell
   * @description The method is used to sell a new asset on the ChainX Blockchain
   *
   * @param assetName - The name of the asset to sell
   * @param PolicyId - The policyId of the asset to sell
   * @param quantity - The quantity of the asset to be sell
   * @param walletAddress - The address is used to burn a new asset on the ChainX Blockchain
   *
   * @returns unsignedTx - Returns a promise that resolves to the unsigned transaction string
   */
  sell = async ({
    policyId,
    assetName,
    quantity,
    price,
    walletAddress,
  }: {
    policyId: string;
    assetName: string;
    quantity: string;
    price: number;
    walletAddress: string;
  }): Promise<string> => {
    const { utxos: platformUtxos, collateral } = await this.getWalletForTx({ walletAddress: PLATFORM_ADDRESS });
    const { utxos: userUtxos } = await this.getWalletForTx({ walletAddress: walletAddress });
    const userUtxosInput = this.getUtxoForTx({
      utxos: userUtxos,
      unit: PLATFORM_TOKEN,
      quantity: String(20),
    });
    const platformUtxosInput = this.getUtxoOnlyLovelace({
      utxos: platformUtxos,
      unit: "lovelace",
      quantity: String(10_000_000),
    });

    const userUtxoInput = await this.getAddressUTXOAsset(walletAddress, policyId + CIP68_222(stringToHex(assetName)));

    const userChainXAmount = this.getAmountUnit({ utxo: userUtxosInput, unit: PLATFORM_TOKEN });
    const userLovelaceAmount = this.getAmountUnit({
      utxo: userUtxosInput,
      unit: "lovelace",
    });
    const unsignedTx = this.meshTxBuilder
      .txIn(
        userUtxoInput.input.txHash,
        userUtxoInput.input.outputIndex,
        userUtxoInput.output.amount,
        userUtxoInput.output.address,
      )
      .txIn(
        userUtxosInput.input.txHash,
        userUtxosInput.input.outputIndex,
        userUtxosInput.output.amount,
        userUtxosInput.output.address,
      )
      .txIn(
        platformUtxosInput.input.txHash,
        platformUtxosInput.input.outputIndex,
        platformUtxosInput.output.amount,
        platformUtxosInput.output.address,
      )
      .txOut(this.marketplaceAddress, [
        {
          unit: this.policyId + CIP68_222(stringToHex(assetName)),
          quantity: String(1),
        },
      ])
      .txOutInlineDatumValue(
        mConStr0([
          policyId,
          assetName,
          Number(quantity),
          Number(price),
          mConStr0([
            deserializeAddress(walletAddress).pubKeyHash,
            deserializeAddress(walletAddress).stakeCredentialHash,
          ]),
        ]),
      )
      .txOut(walletAddress, [
        {
          unit: "lovelace",
          quantity: String(userLovelaceAmount),
        },
        {
          unit: PLATFORM_TOKEN,
          quantity: String(userChainXAmount - 20),
        },
      ])
      .txOut(PLATFORM_ADDRESS, [
        {
          unit: PLATFORM_TOKEN,
          quantity: String("20"),
        },
      ])

      .changeAddress(walletAddress)
      .changeAddress(PLATFORM_ADDRESS)
      .requiredSignerHash(deserializeAddress(PLATFORM_ADDRESS).pubKeyHash)
      .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
      .selectUtxosFrom(userUtxos)
      .selectUtxosFrom(platformUtxos)
      .txInCollateral(
        collateral.input.txHash,
        collateral.input.outputIndex,
        collateral.output.amount,
        collateral.output.address,
      )
      .setNetwork(appNetwork);

    return await unsignedTx.complete();
  };

  /**
   * @action Refund
   * @description The method is used to refund a asset on the ChainX Blockchain
   *
   * @param assetName - The name of the asset to sell
   * @param PolicyId - The policyId of the asset to sell
   * @param quantity - The quantity of the asset to be sell
   * @param walletAddress - The address is used to burn a new asset on the ChainX Blockchain
   *
   * @returns unsignedTx - Returns a promise that resolves to the unsigned transaction string
   */
  refund = async ({
    policyId,
    assetName,
    quantity,
    price,
    walletAddress,
  }: {
    policyId: string;
    assetName: string;
    quantity: number;
    price: number;
    walletAddress: string;
  }): Promise<string> => {
    const unsignedTx = this.meshTxBuilder;

    return await unsignedTx.complete();
  };

  /**
   * @action Buy
   * @description The method is used to buy a asset on the ChainX Blockchain
   *
   * @param assetName - The name of the asset to sell
   * @param PolicyId - The policyId of the asset to sell
   * @param quantity - The quantity of the asset to be sell
   * @param walletAddress - The address is used to burn a new asset on the ChainX Blockchain
   *
   * @returns unsignedTx - Returns a promise that resolves to the unsigned transaction string
   */
  buy = async ({
    policyId,
    assetName,
    quantity,
    walletAddress,
  }: {
    policyId: string;
    assetName: string;
    quantity: number;
    walletAddress: string;
  }): Promise<string> => {
    const unsignedTx = this.meshTxBuilder;

    return await unsignedTx.complete();
  };
}
