import { Cip68Adapter } from "@/api/adapters/cip68.adapter";
import { appNetwork, PLATFORM_ADDRESS, PLATFORM_TOKEN } from "@/contracts/constants";
import { CIP68_100, CIP68_222, deserializeAddress, mConStr0, metadataToCip68, stringToHex } from "@meshsdk/core";

export class Cip68Service extends Cip68Adapter {
  /**
   * @action Mint
   * @description This method is used to mint a new asset on the ChainX blockchain.
   *
   * @param walletAddress - The address of the wallet that will receive the minted asset.
   * @param assetName - The name of the asset to be minted.
   * @param quantity - The quantity of the asset to be minted.
   * @param metadata - Metadata associated with the asset.
   *
   * @returns unsignedTx - Returns a promise that resolves to the unsigned transaction string.
   */
  mint = async ({
    walletAddress,
    assetName,
    quantity,
    metadata,
  }: {
    walletAddress: string;
    assetName: string;
    quantity: string;
    metadata: Record<string, string>;
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



    const userChainXAmount = this.getAmountUnit({ utxo: userUtxosInput, unit: PLATFORM_TOKEN });
    const userLovelaceAmount = this.getAmountUnit({
      utxo: userUtxosInput,
      unit: "lovelace",
    });

    const unsignedTx = await this.meshTxBuilder

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

      .mintPlutusScript("V3")
      .mint(String(quantity), this.policyId, CIP68_222(stringToHex(assetName)))
      .mintingScript(this.mintScriptCbor)
      .mintRedeemerValue(mConStr0([]))

      .mintPlutusScript("V3")
      .mint(String("1"), this.policyId, CIP68_100(stringToHex(assetName)))
      .mintingScript(this.mintScriptCbor)
      .mintRedeemerValue(mConStr0([]))

      .txOut(this.storeAddress, [
        {
          unit: this.policyId + CIP68_100(stringToHex(assetName)),
          quantity: String(1),
        },
      ])
      .txOutInlineDatumValue(metadataToCip68(metadata))

      .txOut(walletAddress, [
        {
          unit: this.policyId + CIP68_222(stringToHex(assetName)),
          quantity: String(quantity),
        },
      ])

      .txOut(walletAddress, [
        {
          unit: "lovelace",
          quantity: String(userLovelaceAmount),
        },
        {
          unit: PLATFORM_TOKEN,
          quantity: String(userChainXAmount - 20), // 20 is the fee for minting
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
      .setNetwork(appNetwork)
      .complete();

    return unsignedTx;
  };

  update = async ({}): Promise<string> => {
    return "";
  };

  burn = async ({}): Promise<string> => {
    return "";
  };
}
