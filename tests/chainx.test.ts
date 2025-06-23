import "dotenv/config";
import { ChainXTxBuilder } from "../src/txbuilders/chainx.txbuilder";
import { blockfrostProvider } from "../src/libs";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { MeshWallet } from "@meshsdk/core";

describe("Mint", function () {
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
    console.log("Hello");
    const chainXContract: ChainXTxBuilder = new ChainXTxBuilder({
      wallet: wallet,
    });
    const unsignedTx: string = await chainXContract.mint({ assetName: "Chain X", quantity: 1000_000_000 });
    const signedTx = await wallet.signTx(unsignedTx, true);
    const txHash = await wallet.submitTx(signedTx);
    console.log("https://preview.cexplorer.io/tx/" + txHash);
    expect(txHash.length).toBe(64);
  });
});
