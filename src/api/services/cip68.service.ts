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
    const { utxos: walletUtxos } = await this.getWalletForTx({ walletAddress: walletAddress });

    const unsignedTx = await this.meshTxBuilder

      .mintPlutusScript("V3")
      .mint(String(quantity), this.policyId, CIP68_222(stringToHex(assetName)))
      .mintingScript(this.mintScriptCbor)
      .mintRedeemerValue(mConStr0([]))

      .mintPlutusScript("V3")
      .mint(String(quantity), this.policyId, CIP68_100(stringToHex(assetName)))
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

      .txOut(PLATFORM_ADDRESS, [
        {
          unit: PLATFORM_TOKEN,
          quantity: String("1"),
        },
      ])

      .changeAddress(PLATFORM_ADDRESS)
      .changeAddress(walletAddress)
      .requiredSignerHash(deserializeAddress(PLATFORM_ADDRESS).pubKeyHash)
      .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
      .selectUtxosFrom(platformUtxos)
      .selectUtxosFrom(walletUtxos)
      .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
      .setNetwork(appNetwork)
      .complete();

    return unsignedTx;
  };
}
