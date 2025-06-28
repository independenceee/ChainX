import { Request, Response } from "express";
import { MarketplaceService } from "../services/marketplace.service";

export default new (class MarketplaceController {
  protected marketplaceService: MarketplaceService;
  constructor() {
    this.marketplaceService = new MarketplaceService();
  }

  /**
   * @action POST /marketplace/buy
   * @description This method is used to buy asset on the ChainX Blockchain
   *
   * @param request
   * @param response
   */
  buy = async (request: Request, response: Response) => {
    const { walletAddress, policyId, assetName, quantity } = request.body;

    if (!walletAddress || !assetName || !quantity || !policyId) {
      response.status(400).json({ error: "Missing required fields." });
    }

    try {
      const unsignedTx = await this.marketplaceService.mint({ walletAddress, assetName, quantity });
      response.status(200).json({ unsignedTx });
    } catch (error) {
      response.status(500).json({ error: "Minting failed." });
    }
  };

  /**
   * @action POST /marketplace/sell
   * @description This method is used to sell asset on the ChainX Blockchain
   *
   * @param request
   * @param response
   */
  sell = async (request: Request, response: Response) => {
    const { walletAddress, policyId, assetName, quantity, price } = request.body;
    if (!walletAddress || !assetName || !quantity || !policyId || !price) {
      response.status(400).json({ error: "Missing required fields." });
    }

    try {
      const unsignedTx = await this.marketplaceService.sell({ walletAddress, assetName, quantity, policyId, price });
      response.status(200).json({ unsignedTx });
    } catch (error) {
      response.status(500).json({ error: "Minting failed." });
    }
  };

  /**
   * @action POST /marketplace/mint
   * @description This method is used to mint asset on the ChainX Blockchain
   *
   * @param request
   * @param response
   */
  mint = async (request: Request, response: Response) => {
    const { walletAddress, assetName, quantity } = request.body;
    if (!walletAddress || !assetName || !quantity) {
      response.status(400).json({ error: "Missing required fields." });
    }

    try {
      const unsignedTx = await this.marketplaceService.mint({ walletAddress, assetName, quantity });
      response.status(200).json({ unsignedTx });
    } catch (error) {
      response.status(500).json({ error: "Minting failed." });
    }
  };

  /**
   * @action POST /marketplace/burn
   * @description This method is used to mint asset on the ChainX Blockchain
   *
   * @param request
   * @param response
   */
  burn = async (request: Request, response: Response) => {
    const { walletAddress, assetName, quantity } = request.body;
    if (!walletAddress || !assetName || !quantity) {
      response.status(400).json({ error: "Missing required fields." });
    }

    try {
      const unsignedTx = await this.marketplaceService.burn({ walletAddress, assetName, quantity });
      response.status(200).json({ unsignedTx });
    } catch (error) {
      response.status(500).json({ error: "Minting failed." });
    }
  };

  /**
   * @action POST /marketplace/refund
   * @description This method is used to refund asset on the ChainX Blockchain
   *
   * @param request
   * @param response
   */
  refund = async (request: Request, response: Response) => {
    const { policyId, assetName, quantity, walletAddress, price } = request.body;
    if (!walletAddress || !assetName || !quantity) {
      response.status(400).json({ error: "Missing required fields." });
    }

    try {
      const unsignedTx = await this.marketplaceService.refund({ policyId, assetName, quantity, walletAddress, price });
      response.status(200).json({ unsignedTx });
    } catch (error) {
      response.status(500).json({ error: "Minting failed." });
    }
  };
})();
