import {
  applyParamsToScript,
  deserializeAddress,
  IFetcher,
  MeshTxBuilder,
  PlutusScript,
  resolveScriptHash,
  scriptAddress,
  serializeAddressObj,
  serializePlutusScript,
  UTxO,
} from "@meshsdk/core";
import { blockfrostProvider } from "@/contracts/libs";
import { Plutus } from "@/contracts/types";
import plutus from "../../../plutus.json";
import { appNetworkId, PLATFORM_TOKEN, titles } from "@/contracts/constants";

export class MarketplaceAdapter {
  protected meshTxBuilder: MeshTxBuilder;
  protected fetcher: IFetcher;
  protected mintCompileCode: string;
  protected marketplaceCompileCode: string;
  protected marketplaceScriptCbor: string;
  protected mintScriptCbor: string;
  protected marketplaceScript: PlutusScript;
  protected mintScript: PlutusScript;
  protected marketplaceAddress: string;
  protected policyId: string;

  constructor() {
    this.fetcher = blockfrostProvider;
    this.meshTxBuilder = new MeshTxBuilder({
      fetcher: this.fetcher,
      evaluator: blockfrostProvider,
    });

    this.mintCompileCode = this.readValidator(plutus as Plutus, titles.chainx);
    this.marketplaceCompileCode = this.readValidator(plutus as Plutus, titles.marketplace);

    this.marketplaceScriptCbor = applyParamsToScript(this.marketplaceCompileCode, []);
    this.marketplaceScript = {
      code: this.marketplaceScriptCbor,
      version: "V3",
    };
    this.marketplaceAddress = serializeAddressObj(
      scriptAddress(
        deserializeAddress(serializePlutusScript(this.marketplaceScript, undefined, appNetworkId, false).address)
          .scriptHash,
        "",
        false,
      ),
      appNetworkId,
    );

    this.mintScriptCbor = applyParamsToScript(this.mintCompileCode, []);
    this.mintScript = {
      code: this.mintScriptCbor,
      version: "V3",
    };

    this.policyId = resolveScriptHash(this.mintScriptCbor, "V3");
  }

  protected readValidator = function (plutus: Plutus, title: string): string {
    const validator = plutus.validators.find(function (validator) {
      return validator.title === title;
    });

    if (!validator) {
      throw new Error(`${title} validator not found.`);
    }

    return validator.compiledCode;
  };

  protected getWalletForTx = async ({
    walletAddress,
  }: {
    walletAddress: string;
  }): Promise<{ walletAddress: string; utxos: Array<UTxO>; collateral: UTxO; utxoChainX: Array<UTxO> }> => {
    const utxos = await this.fetcher.fetchAddressUTxOs(walletAddress);
    const collaterals = await this.fetcher.fetchAddressUTxOs(walletAddress, "lovelace");
    const utxoChainX = await this.fetcher.fetchAddressUTxOs(walletAddress, PLATFORM_TOKEN);
    if (!utxos || utxos.length === 0) throw new Error("No UTXOs found in getWalletForTx method.");
    if (!collaterals || collaterals.length === 0) throw new Error("No collateral found in getWalletForTx method.");
    if (!walletAddress) throw new Error("No wallet address found in getWalletForTx method.");
    return { utxos, collateral: collaterals[0], walletAddress, utxoChainX };
  };

  getUtxoOnlyLovelace = ({ utxos, unit, quantity }: { utxos: UTxO[]; unit: string; quantity: string }): UTxO => {
    return utxos.filter(function (utxo) {
      const utxoOnlyUnit = utxo.output.amount.every(function (amount) {
        return amount.unit === "lovelace";
      });
      const utxoEnoughQuantity = utxo.output.amount.some(function (amount) {
        return amount.unit === unit && Number(amount.quantity) >= Number(quantity);
      });
      return utxoOnlyUnit && utxoEnoughQuantity;
    })[0];
  };

  getUtxoForTx = ({ utxos, unit, quantity }: { utxos: UTxO[]; unit: string; quantity: string }): UTxO => {
    return utxos.filter(function (utxo) {
      const utxoEnoughQuantity = utxo.output.amount.some(function (amount) {
        return amount.unit === unit && Number(amount.quantity) >= Number(quantity);
      });
      return utxoEnoughQuantity;
    })[0];
  };

  getUtxoForTxHash = async (address: string, txHash: string) => {
    const utxos: UTxO[] = await this.fetcher.fetchAddressUTxOs(address);
    const utxo = utxos.find(function (utxo: UTxO) {
      return utxo.input.txHash === txHash;
    });

    if (!utxo) throw new Error("No UTXOs found in getUtxoForTx method.");
    return utxo;
  };

  getAmountUnit = ({ utxo, unit }: { utxo: UTxO; unit: string }): number => {
    const total = utxo.output.amount
      .filter((amount) => amount.unit === unit)
      .reduce((sum, amount) => sum + Number(amount.quantity), 0);
    return total;
  };

  protected getAddressUTXOAsset = async (address: string, unit: string) => {
    const utxos = await this.fetcher.fetchAddressUTxOs(address, unit);
    return utxos[utxos.length - 1];
  };

  protected getAddressUTXOAssets = async (address: string, unit: string) => {
    return await this.fetcher.fetchAddressUTxOs(address, unit);
  };
}
