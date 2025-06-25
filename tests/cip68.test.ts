import "dotenv/config";
import { blockfrostProvider } from "../src/contracts/libs";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { MeshWallet } from "@meshsdk/core";
import { Cip68Service } from "../src/api/services/cip68.service";
describe("Mint, Burn, Update", function () {
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
    const signedTx = await userWallet.signTx(unsignedTx, true);
    console.log(signedTx);
  });

  test("Update", async function () {
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
    const signedTx = await userWallet.signTx(unsignedTx, true);
    console.log(signedTx);
  });

  test("Burn", async function () {
    const cip68Service: Cip68Service = new Cip68Service();
    const unsignedTx: string = await cip68Service.burn({
      assetName: "Lychee",
      walletAddress:
        "addr_test1qqsy43jcmcmrpn3fyqyl7yjrqsyktq4ttatpgrxa6xpjs9kr8c058qthpyvr5j5s338vr00x0hgq60saq9jwm30xe04s7nxk3k",
      quantity: "-1",
    });
    const signedTx = await userWallet.signTx(unsignedTx, true);
    console.log(signedTx);
  });
});
