import "dotenv/config";
import express, { Express } from "express";
import swaggerUtil from "./utils/swagger.util";

import cip68 from "@/api/routes/cip68.route";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// app.use("/documents", swaggerUtil.swaggerUi.serve, swaggerUtil.swaggerUi.setup(swaggerUtil.specs));

app.use("/api/v1/mint", cip68);

app.listen(port, () => {
  console.log(`https://localhost:${port}`);
});

export default app;
