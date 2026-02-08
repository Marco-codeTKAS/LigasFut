import { Router } from "express";

export const playersRouter = Router();

playersRouter.get("/", (_req, res) => {
  res.json({ data: [], message: "List of players" });
});

playersRouter.post("/", (_req, res) => {
  res.status(201).json({ message: "Player created" });
});
