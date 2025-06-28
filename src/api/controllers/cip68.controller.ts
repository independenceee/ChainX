import { Request, Response } from "express";
import { Cip68Service } from "../services/cip68.service";

export default new (class Cip68Controller {
  protected cip68Service: Cip68Service;
  constructor() {
    this.cip68Service = new Cip68Service();
  }

  /**
   * @action POST /cip68/mint
   * @description This method is used to mint a new asset on the ChainX blockchain.
   *
   * @param request
   * @param response
   */
  mint = async (request: Request, response: Response) => {
    const { walletAddress, assetName, quantity, metadata } = request.body;

    if (!walletAddress || !assetName || !quantity) {
      response.status(400).json({ error: "Missing required fields." });
    }

    try {
      const unsignedTx = await this.cip68Service.mint({ walletAddress, assetName, quantity, metadata });
      response.status(200).json({ unsignedTx });
    } catch (error) {
      response.status(500).json({ error: "Minting failed." });
    }
  };

  /**
   * @action POST /cip68/burn
   * @description This method is used to mint a new asset on the ChainX blockchain.
   *
   * @param request
   * @param response
   */
  async burn(request: Request, response: Response) {
    const { walletAddress, assetName, quantity } = request.body;

    if (!walletAddress || !assetName || !quantity) {
      response.status(400).json({ error: "Missing required fields." });
    }

    try {
      const unsignedTx = await this.cip68Service.burn({ walletAddress, assetName, quantity });
      response.status(200).json({ unsignedTx });
    } catch (error) {
      response.status(500).json({ error: "Minting failed." });
    }
  }

  /**
   * @action POST /cip68/update
   * @description This method is used to mint a new asset on the ChainX blockchain.
   *
   * @param request
   * @param response
   */
  async update(request: Request, response: Response) {
    const { walletAddress, assetName, metadata } = request.body;

    if (!walletAddress || !assetName || !metadata) {
      response.status(400).json({ error: "Missing required fields." });
    }

    try {
      const unsignedTx = await this.cip68Service.update({ walletAddress, assetName, metadata });
      response.status(200).json({ unsignedTx });
    } catch (error) {
      response.status(500).json({ error: "Minting failed." });
    }
  }
})();
