import { Network } from "@meshsdk/core";

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || "";
const KOIOS_TOKEN = process.env.KOIOS_TOKEN || "";

const appNetwork: Network = (process.env.NEXT_PUBLIC_APP_NETWORK?.toLowerCase() as Network) || "preprod";
const PLATFORM_ADDRESS =
  process.env.PLATFORM_ADDRESS || "addr_test1qqx7c0sx4ag8pltlyhl5r9qgjk5yhxevx7we9sfezrejugklnqmrrnpunckf5xt53axprgc4cw73n94fm3y88qszvpgqlhj8na";
const appNetworkId = appNetwork === "mainnet" ? 1 : 0;
const titles = {
  chainx: "chainx.chainx.mint",
  mint: "mint.mint.mint",
  store: "store.store.spend",
};

export { appNetwork, appNetworkId, BLOCKFROST_API_KEY, KOIOS_TOKEN, titles, PLATFORM_ADDRESS };
