import { Express } from "express";
import cip68 from "@/api/routes/cip68.route";

export default function routers(app: Express) {
  app.use("/api/v1/mint", cip68);
}
