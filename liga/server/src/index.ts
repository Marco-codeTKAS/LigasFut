import express from "express";
import cors from "cors";
import "dotenv/config";
import { router } from "./routes/index.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);
app.use(errorHandler);

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`API running on :${port}`);
});
