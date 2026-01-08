import { Router } from 'express';
import * as instructorServices from "./services/instructor.service.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";

const instructorController = Router();

instructorController.post("/assign", auth(), requireRole("instructor"), instructorServices.assignStudent);
instructorController.get("/students", auth(), requireRole("instructor"), instructorServices.getAssignedStudents);
instructorController.post("/review", auth(), requireRole("instructor"), instructorServices.feedbackReport);
instructorController.patch("/feedback", auth(), requireRole("instructor"), instructorServices.updateFeedback);
instructorController.post("/score", auth(), requireRole("instructor"), instructorServices.scoreReport);
instructorController.patch("/score", auth(), requireRole("instructor"), instructorServices.editScore);
instructorController.get("/reports", auth(), requireRole("instructor"), instructorServices.getReviewedReports);

export default instructorController;
