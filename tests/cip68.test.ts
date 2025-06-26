import "dotenv/config";
import { blockfrostProvider } from "../src/contracts/libs";
import { beforeEach, describe, test } from "@jest/globals";
import { MeshWallet } from "@meshsdk/core";
import { Cip68Service } from "../src/api/services/cip68.service";
describe("Cip68", function () {
  let platformWallet: MeshWallet;
  let userWallet: MeshWallet;

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

    userWallet = new MeshWallet({
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
    const cip68Service: Cip68Service = new Cip68Service();
    const unsignedTx: string = await cip68Service.mint({
      assetName: "Lychee",
      quantity: "10000",
      walletAddress:
        "addr_test1qqsy43jcmcmrpn3fyqyl7yjrqsyktq4ttatpgrxa6xpjs9kr8c058qthpyvr5j5s338vr00x0hgq60saq9jwm30xe04s7nxk3k",
      metadata: {
        name: "Lychee",
        description: "A sweet and juicy fruit",
        image: "https://example.com/lychee.png",
      },
    });
    const platformSignedTx = await platformWallet.signTx(unsignedTx, true);
    const userSignedTx = await userWallet.signTx(platformSignedTx, true);
    const txHash = await userWallet.submitTx(userSignedTx);
    console.log("https://preview.cexplorer.io/tx/" + txHash);
  });

  test("Update", async function () {
    return;
    const cip68Service: Cip68Service = new Cip68Service();
    const unsignedTx: string = await cip68Service.update({
      assetName: "Lychee",
      walletAddress:
        "addr_test1qqsy43jcmcmrpn3fyqyl7yjrqsyktq4ttatpgrxa6xpjs9kr8c058qthpyvr5j5s338vr00x0hgq60saq9jwm30xe04s7nxk3k",
      metadata: {
        name: "Lychee",
        description: "A sweet and juicy fruit",
        image: "https://example.com/lychee.png",
      },
    });
    const platformSignedTx = await platformWallet.signTx(unsignedTx, true);
    const userSignedTx = await userWallet.signTx(platformSignedTx, true);
    const txHash = await userWallet.submitTx(userSignedTx);
    console.log("https://preview.cexplorer.io/tx/" + txHash);
  });

  test("Burn", async function () {
    return;
    const cip68Service: Cip68Service = new Cip68Service();
    const unsignedTx: string = await cip68Service.burn({
      assetName: "Lychee",
      walletAddress:
        "addr_test1qqsy43jcmcmrpn3fyqyl7yjrqsyktq4ttatpgrxa6xpjs9kr8c058qthpyvr5j5s338vr00x0hgq60saq9jwm30xe04s7nxk3k",
      quantity: "-10000",
    });
    const platformSignedTx = await platformWallet.signTx(unsignedTx, true);
    const userSignedTx = await userWallet.signTx(platformSignedTx, true);
    const txHash = await userWallet.submitTx(userSignedTx);
    console.log("https://preview.cexplorer.io/tx/" + txHash);
  });
});
