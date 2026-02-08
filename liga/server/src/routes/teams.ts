import { Router } from "express";

export const teamsRouter = Router();

teamsRouter.get("/", (_req, res) => {
  res.json({ data: [], message: "List of teams" });
});

teamsRouter.post("/", (_req, res) => {
  res.status(201).json({ message: "Team created" });
});
