import { Request, Response } from "express";
import { MarketplaceService } from "../services/marketplace.service";

export default new (class MarketplaceController {
  protected marketplaceService: MarketplaceService;
  constructor() {
    this.marketplaceService = new MarketplaceService();
  }

  
  buy = async (request: Request, response: Response) => {};
  sell = async (request: Request, response: Response) => {};
  mint = async (request: Request, response: Response) => {};
  refund = async (request: Request, response: Response) => {};
})();
