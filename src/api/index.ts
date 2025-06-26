import "dotenv/config";
import express, { Express, Request, Response } from "express";
import swaggerUtil from "@/api/utils/swagger.util";
import cip68 from "@/api/routes/index.route";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/documents", swaggerUtil.swaggerUi.serve, swaggerUtil.swaggerUi.setup(swaggerUtil.specs));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to ChainX API! Visit /api-docs for documentation." });
});

app.use("/api/v1/cip68", cip68);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

export default app;
