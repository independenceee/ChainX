import {
  applyParamsToScript,
  deserializeAddress,
  IFetcher,
  MeshTxBuilder,
  PlutusScript,
  resolveScriptHash,
  serializePlutusScript,
  scriptAddress,
  serializeAddressObj,
  UTxO,
} from "@meshsdk/core";
import { blockfrostProvider } from "@/contracts/libs";
import { Plutus, UtXO } from "@/contracts/types";
import plutus from "../../plutus.json";
import { titles, appNetworkId, PLATFORM_TOKEN } from "@/contracts/constants";

export class Cip68Adapter {
  protected meshTxBuilder: MeshTxBuilder;
  protected fetcher: IFetcher;
  protected mintCompileCode: string;
  protected storeCompileCode: string;
  protected storeScriptCbor: string;
  protected mintScriptCbor: string;
  protected storeScript: PlutusScript;
  protected mintScript: PlutusScript;
  protected storeAddress: string;
  protected policyId: string;

  constructor() {
    this.fetcher = blockfrostProvider;
    this.meshTxBuilder = new MeshTxBuilder({
      fetcher: this.fetcher,
      evaluator: blockfrostProvider,
    });

    this.mintCompileCode = this.readValidator(plutus as Plutus, titles.mint);
    this.storeCompileCode = this.readValidator(plutus as Plutus, titles.store);

    this.storeScriptCbor = applyParamsToScript(this.storeCompileCode, []);

    this.storeScript = {
      code: this.storeScriptCbor,
      version: "V3",
    };

    this.storeAddress = serializeAddressObj(
      scriptAddress(deserializeAddress(serializePlutusScript(this.storeScript, undefined, appNetworkId, false).address).scriptHash, "", false),
      appNetworkId,
    );

    this.mintScriptCbor = applyParamsToScript(this.mintCompileCode, []);
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

  protected getWalletForTx = async ({
    walletAddress,
  }: {
    walletAddress: string;
  }): Promise<{ walletAddress: string; utxos: Array<UTxO>; collateral: UTxO; utxoChainX: Array<UTxO> }> => {
    const utxos = await this.fetcher.fetchAddressUTxOs(walletAddress);
    const collaterals = await this.fetcher.fetchAddressUTxOs(walletAddress, "lovelace");
    console.log(collaterals);
    const utxoChainX = await this.fetcher.fetchAddressUTxOs(walletAddress, PLATFORM_TOKEN);

    if (!utxos || utxos.length === 0) throw new Error("No UTXOs found in getWalletForTx method.");

    if (!collaterals || collaterals.length === 0) throw new Error("No collateral found in getWalletForTx method.");

    if (!walletAddress) throw new Error("No wallet address found in getWalletForTx method.");

    return { utxos, collateral: collaterals[0], walletAddress, utxoChainX };
  };
}
