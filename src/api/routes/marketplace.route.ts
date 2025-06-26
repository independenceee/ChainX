import { Router } from "express";
import marketplaceController from "../controllers/marketplace.controller";

const router = Router();

router.route("/buy").post(marketplaceController.buy);
router.route("/sell").post(marketplaceController.sell);
router.route("/mint").post(marketplaceController.mint);
router.route("/refund").post(marketplaceController.refund);

export default router;
