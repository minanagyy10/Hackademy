import {Router} from 'express';
import * as instructorServices from "./services/instructor.service.js";

const instructorController = Router();

instructorController.post("/assign", instructorServices.assignStudent);
instructorController.get("/students", instructorServices.getAssignedStudents);
instructorController.post("/review", instructorServices.feedbackReport);
instructorController.patch("/feedback", instructorServices.updateFeedback);
instructorController.post("/score", instructorServices.scoreReport);
instructorController.patch("/score", instructorServices.editScore);
instructorController.get("/reports", instructorServices.getReviewedReports);

export default instructorController;
