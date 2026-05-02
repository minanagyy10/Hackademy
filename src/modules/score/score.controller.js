import {Router} from 'express';
import * as scoreServices from "./services/score.service.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const scoreController = Router();

scoreController.post("/assign", requireRole("instructor"), scoreServices.assignScoreToReport);
scoreController.patch("/edit", requireRole("instructor"), scoreServices.editReportScore);
scoreController.get("/report/:reportId", scoreServices.getScoreOfReport);
//Should chech this router again (why /student/scores ?)
scoreController.get("/student/scores", requireRole("student"), scoreServices.getScoresOfStudent);
scoreController.get("/leaderboard", scoreServices.leaderboard);

export default scoreController;
