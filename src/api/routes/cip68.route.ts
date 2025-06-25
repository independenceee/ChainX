import { Router } from "express";
import cip68Controller from "../controllers/cip68.controller";
const router = Router();

router.route("/mint").post(cip68Controller.mint);
router.route("/burn").post();
router.route("/update").post();

export default router;
