import { Network } from "@meshsdk/core";

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || "";
const KOIOS_TOKEN = process.env.KOIOS_TOKEN || "";

const appNetwork: Network = (process.env.NEXT_PUBLIC_APP_NETWORK?.toLowerCase() as Network) || "preprod";
const PLATFORM_ADDRESS =
  process.env.PLATFORM_ADDRESS ||
  "addr_test1qqx7c0sx4ag8pltlyhl5r9qgjk5yhxevx7we9sfezrejugklnqmrrnpunckf5xt53axprgc4cw73n94fm3y88qszvpgqlhj8na";
const PLATFORM_TOKEN =
  process.env.PLATFORM_TOKEN || "efb917ea5283a7f447302247f3a62e3b48a3288747f72c5b73c9c5a9436861696e2058";
const appNetworkId = appNetwork === "mainnet" ? 1 : 0;
const titles = {
  mint: "mint.mint.mint",
  store: "store.store.spend",
  chainx: "marketplace.marketplace.mint",
  marketplace: "marketplace.marketplace.spend",
};

export { appNetwork, appNetworkId, BLOCKFROST_API_KEY, KOIOS_TOKEN, titles, PLATFORM_TOKEN, PLATFORM_ADDRESS };
