import { IFetcher, MeshTxBuilder } from "@meshsdk/core";
import { blockfrostProvider } from "@/contracts/libs";

export class MarketplaceAdapter {
  protected meshTxBuilder: MeshTxBuilder;
  protected fetcher: IFetcher;

  constructor() {
    this.fetcher = blockfrostProvider;
    this.meshTxBuilder = new MeshTxBuilder({
      fetcher: this.fetcher,
      evaluator: blockfrostProvider,
    });
  }
}
