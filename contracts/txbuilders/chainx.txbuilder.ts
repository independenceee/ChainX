import { MeshAdapter } from "../adapters/chainx.adapter";
import { appNetwork } from "../constants";
import { mConStr0, stringToHex } from "@meshsdk/core";

export class ChainXTxBuilder extends MeshAdapter {
  /**
   * @action Mint
   *
   * @description This method is used to mint a new asset on the ChainX blockchain.
   * @param {string} assetName - The name of the asset to be minted.
   * @param {string} quantity - The quantity of the asset to be minted.
   * @param {string} receiver - The address of the receiver who will receive the minted asset.
   * @returns {Promise<string>} - Returns a promise that resolves to the transaction hash of
   */

  mint = async ({ quantity, assetName, receiver }: { quantity: number; assetName: string; receiver?: string }): Promise<string> => {
    const { collateral, utxos, walletAddress } = await this.getWalletForTx();

    const unsignedTx = await this.meshTxBuilder

      .mintPlutusScriptV3()
      .mint(String(quantity), this.policyId, stringToHex(assetName))
      .mintingScript(this.mintScriptCbor)
      .mintRedeemerValue(mConStr0([]))
      .txOut(receiver ?? walletAddress, [
        {
          unit: this.policyId + stringToHex(assetName),
          quantity: String(quantity),
        },
      ])

      .setNetwork(appNetwork)
      .requiredSignerHash(this.platformPaymentAddress)
      .selectUtxosFrom(utxos)
      .changeAddress(walletAddress)
      .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
      .complete();

    return unsignedTx;
  };
}
