import { Router } from "express";

export const standingsRouter = Router();

standingsRouter.get("/", (_req, res) => {
  res.json({ data: [], message: "Standings" });
});
