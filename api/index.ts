import express, { Express } from "express";
import routers from "./routes/index.route";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

routers(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
