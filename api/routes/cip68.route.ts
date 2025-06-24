import { Router } from "express";

const router = Router();

router.route("/mint").post();
router.route("/burn").post();
router.route("/update").post();

export default router;
