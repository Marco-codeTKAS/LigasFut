import { Router } from "express";
import { healthRouter } from "./health.js";
import { teamsRouter } from "./teams.js";
import { playersRouter } from "./players.js";
import { matchesRouter } from "./matches.js";
import { standingsRouter } from "./standings.js";

export const router = Router();

router.use("/health", healthRouter);
router.use("/teams", teamsRouter);
router.use("/players", playersRouter);
router.use("/matches", matchesRouter);
router.use("/standings", standingsRouter);
