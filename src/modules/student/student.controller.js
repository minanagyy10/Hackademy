import {Router} from 'express';
import * as studentServices from "./services/student.service.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const studentController = Router();

studentController.post("/submitReport", requireRole("student"), studentServices.submitReport);
studentController.get("/reports", requireRole("student"), studentServices.getMyReports);
studentController.get("/totalScore", requireRole("student"), studentServices.getMyTotalScore);
studentController.get("/instructor", requireRole("student"), studentServices.getAssignedInstructor);

export default studentController;
