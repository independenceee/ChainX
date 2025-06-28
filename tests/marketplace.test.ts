import { blockfrostProvider } from "../src/contracts/libs";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { MeshWallet } from "@meshsdk/core";
import { MarketplaceService } from "../src/api/services/marketplace.service";
import { PLATFORM_ADDRESS } from "../src/contracts/constants";

describe("Marketplace", function () {
  let platformWallet: MeshWallet;
  let sellWallet: MeshWallet;
  let buyWallet: MeshWallet;

  beforeEach(async function () {
    platformWallet = new MeshWallet({
      networkId: 0,
      fetcher: blockfrostProvider,
      submitter: blockfrostProvider,
      key: {
        type: "mnemonic",
        words: process.env.PLATFORM_MEMONIC?.split(" ") || [],
      },
    });
    sellWallet = new MeshWallet({
      networkId: 0,
      fetcher: blockfrostProvider,
      submitter: blockfrostProvider,
      key: {
        type: "mnemonic",
        words: process.env.USER_MEMONIC?.split(" ") || [],
      },
    });
    buyWallet = new MeshWallet({
      networkId: 0,
      fetcher: blockfrostProvider,
      submitter: blockfrostProvider,
      key: {
        type: "mnemonic",
        words: process.env.USER_MEMONIC?.split(" ") || [],
      },
    });
  });

  test("Mint", async function () {
    return;
    const marketplaceService = new MarketplaceService();

    const unsignedTx = await marketplaceService.mint({
      assetName: "Chain X",
      quantity: "1000000",
      walletAddress: PLATFORM_ADDRESS,
    });

    const signedTx = await platformWallet.signTx(unsignedTx, true);
    const txHash = await platformWallet.submitTx(signedTx);

    console.log("https://preview.cexplorer.io/tx/" + txHash);
  });

  test("Burn", async function () {
    return;
    const marketplaceService = new MarketplaceService();

    const unsignedTx = await marketplaceService.burn({
      assetName: "Chain X",
      quantity: "-1000000",
      walletAddress: PLATFORM_ADDRESS,
    });

    const signedTx = await platformWallet.signTx(unsignedTx, true);
    const txHash = await platformWallet.submitTx(signedTx);

    console.log("https://preview.cexplorer.io/tx/" + txHash);
  });

  test("Buy", async function () {
    return;
    const marketplaceService = new MarketplaceService();

    const unsignedTx = await marketplaceService.buy({
      policyId: "def68337867cb4f1f95b6b811fedbfcdd7780d10a95cc072077088ea",
      assetName: "Banana",
      quantity: 1,
      walletAddress:
        "addr_test1qqsy43jcmcmrpn3fyqyl7yjrqsyktq4ttatpgrxa6xpjs9kr8c058qthpyvr5j5s338vr00x0hgq60saq9jwm30xe04s7nxk3k",
    });

    const signedTx = await buyWallet.signTx(unsignedTx, true);
    const txHash = await buyWallet.submitTx(signedTx);

    console.log("https://preview.cexplorer.io/tx/" + txHash);
  });
  test("Sell", async function () {
    return;
    const marketplaceService = new MarketplaceService();

    const unsignedTx = await marketplaceService.sell({
      policyId: "def68337867cb4f1f95b6b811fedbfcdd7780d10a95cc072077088ea",
      assetName: "Banana",
      quantity: "1",
      price: 10,
      walletAddress:
        "addr_test1qqsy43jcmcmrpn3fyqyl7yjrqsyktq4ttatpgrxa6xpjs9kr8c058qthpyvr5j5s338vr00x0hgq60saq9jwm30xe04s7nxk3k",
    });

    const signedTx = await sellWallet.signTx(unsignedTx, true);
    const txHash = await sellWallet.submitTx(signedTx);

    console.log("https://preview.cexplorer.io/tx/" + txHash);
  });
  test("Refund", async function () {
    return;
    const marketplaceService = new MarketplaceService();

    const unsignedTx = await marketplaceService.refund({
      policyId: "def68337867cb4f1f95b6b811fedbfcdd7780d10a95cc072077088ea",
      assetName: "Banana",
      quantity: 1,
      price: 10,
      walletAddress:
        "addr_test1qqsy43jcmcmrpn3fyqyl7yjrqsyktq4ttatpgrxa6xpjs9kr8c058qthpyvr5j5s338vr00x0hgq60saq9jwm30xe04s7nxk3k",
    });
  });
});
