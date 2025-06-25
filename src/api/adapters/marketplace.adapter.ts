import { IFetcher, MeshTxBuilder, PlutusScript } from "@meshsdk/core";
import { blockfrostProvider } from "@/contracts/libs";
import { Plutus } from "@/contracts/types";

export class MarketplaceAdapter {
  protected meshTxBuilder: MeshTxBuilder;
  protected fetcher: IFetcher;
  protected mintCompileCode: string;
  protected marketplaceCompileCode: string;
  protected marketplaceScriptCbor: string;
  protected mintScriptCbor: string;
  protected marketplaceScript: PlutusScript;
  protected mintScript: PlutusScript;
  protected marketplaceAddress: string;
  protected policyId: string;

  constructor() {
    this.fetcher = blockfrostProvider;
    this.meshTxBuilder = new MeshTxBuilder({
      fetcher: this.fetcher,
      evaluator: blockfrostProvider,
    });
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
}
