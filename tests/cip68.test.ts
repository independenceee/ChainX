import "dotenv/config";
import { ChainXTxBuilder } from "../contracts/txbuilders/chainx.txbuilder";
import { blockfrostProvider } from "../contracts/libs";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { MeshWallet } from "@meshsdk/core";
import { Cip68Service } from "../api/services/cip68.service";
describe("Mint, Burn, Update", function () {
  let wallet: MeshWallet;
  beforeEach(async function () {
    wallet = new MeshWallet({
      networkId: 0,
      fetcher: blockfrostProvider,
      submitter: blockfrostProvider,
      key: {
        type: "mnemonic",
        words: process.env.PLATFORM_MEMONIC?.split(" ") || [],
      },
    });
  });

  jest.setTimeout(600000000);

  test("Mint", async function () {
    // return

    const cip68Service: Cip68Service = new Cip68Service();
    const unsignedTx: string = await cip68Service.mint({
      assetName: "Thanh Long",
      quantity: 100_000,
      walletAddress: "addr_test1qrr879mjnxd3gjqjdgjxkwzfcnvcgsve927scqk5fc3gfs2hs03pn7uhujentyhzq3ays72u4xtfrlahyjalujhxufsqdeezc0",
      metadata: {
        name: "Thanh Long",
        description: "This is a test asset for ChainX",
        image: "https://example.com/image.png",
      },
    });
    const signedTx = await wallet.signTx(unsignedTx, true);
    const txHash = await wallet.submitTx(signedTx);
    console.log("https://preview.cexplorer.io/tx/" + txHash);
    expect(txHash.length).toBe(64);
  });
});
