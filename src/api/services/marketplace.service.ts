import { MarketplaceAdapter } from "../adapters/marketplace.adapter";

export class MarketplaceService extends MarketplaceAdapter {
  mint = async ({
    assetName = "Chain X",
    quantity,
    walletAddress,
  }: {
    assetName: string;
    quantity: string;
    walletAddress: string;
  }): Promise<string> => {
    const unsignedTx = this.meshTxBuilder;

    return await unsignedTx.complete();
  };

  

  sell = async ({}): Promise<string> => {
    const unsignedTx = this.meshTxBuilder;

    return await unsignedTx.complete();
  };
  buy = async ({}): Promise<string> => {
    const unsignedTx = this.meshTxBuilder;

    return await unsignedTx.complete();
  };
  refund = async ({}): Promise<string> => {
    const unsignedTx = this.meshTxBuilder;

    return await unsignedTx.complete();
  };
}
