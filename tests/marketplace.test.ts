import { blockfrostProvider } from "../src/contracts/libs";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { MeshWallet } from "@meshsdk/core";

describe("Marketplace", function () {
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

  test("Mint", async function () {});
});
