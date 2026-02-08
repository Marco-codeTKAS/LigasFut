import { Router } from "express";

export const matchesRouter = Router();

matchesRouter.get("/", (_req, res) => {
  res.json({ data: [], message: "List of matches" });
});

matchesRouter.post("/", (_req, res) => {
  res.status(201).json({ message: "Match created" });
});
