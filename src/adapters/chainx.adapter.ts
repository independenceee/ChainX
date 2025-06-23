import { applyParamsToScript, deserializeAddress, IFetcher, MeshTxBuilder, MeshWallet, PlutusScript, resolveScriptHash, UTxO } from "@meshsdk/core";
import { blockfrostProvider } from "../libs";
import { Plutus } from "../types";
import plutus from "../../plutus.json";
import { PLATFORM_ADDRESS, titles } from "@/constants";

export class MeshAdapter {
  protected fetcher!: IFetcher;
  protected wallet: MeshWallet;
  protected meshTxBuilder: MeshTxBuilder;
  protected mintCompileCode: string;
  protected mintScriptCbor: string;
  protected mintScript: PlutusScript;
  protected platformPaymentAddress: string = deserializeAddress(PLATFORM_ADDRESS).pubKeyHash;

  public policyId: string;

  constructor({ wallet = null! }: { wallet: MeshWallet }) {
    this.wallet = wallet;
    this.meshTxBuilder = new MeshTxBuilder({
      fetcher: this.fetcher,
      evaluator: blockfrostProvider,
    });
    this.mintCompileCode = this.readValidator(plutus as Plutus, titles.chainx);
    this.mintScriptCbor = applyParamsToScript(this.mintCompileCode, [this.platformPaymentAddress]);
    this.mintScript = {
      code: this.mintScriptCbor,
      version: "V3",
    };
    this.policyId = resolveScriptHash(this.mintScriptCbor, "V3");
  }

  protected readValidator = function (plutus: Plutus, title: string): string {
    const validator = plutus.validators.find(function (validator) {
      return validator.title === title;
    });

    if (!validator) {
      throw new Error(`${title} validator not found.`);
    }

    return validator.compiledCode;
  };

  protected getWalletForTx = async (): Promise<{
    utxos: UTxO[];
    collateral: UTxO;
    walletAddress: string;
  }> => {
    const utxos = await this.wallet.getUtxos();
    const collaterals = await this.wallet.getCollateral();
    const walletAddress = await this.wallet.getChangeAddress();
    if (!utxos || utxos.length === 0) throw new Error("No UTXOs found in getWalletForTx method.");

    if (!collaterals || collaterals.length === 0) throw new Error("No collateral found in getWalletForTx method.");

    if (!walletAddress) throw new Error("No wallet address found in getWalletForTx method.");

    return { utxos, collateral: collaterals[0], walletAddress };
  };
}
