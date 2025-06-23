import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express with TypeScript on Vercel");
});

app.get("/greet", (req, res) => {
  const { name } = req.query;
  res.send(`Welcome ${name || "Guest"}!`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
