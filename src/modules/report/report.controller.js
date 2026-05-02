import {Router} from 'express';
import * as reportServices from './services/report.service.js';
import { requireRole } from "../../middlewares/role.middleware.js";



const reportController = Router();

// Note: createReport is called internally by student service, not directly
// This route is kept for flexibility but should not be used by frontend('submitReport function is the one that will be actually used')
reportController.post("/", requireRole("student"), reportServices.createReport);
reportController.get("/:reportId", reportServices.getReportById);
// Note: getReportsByStudent is called internally by student service, not directly
// This route is kept for flexibility but should not be used by frontend ('getMyReports function is the one that will be actually used')
reportController.get("/student/:studentId", reportServices.getReportsByStudent);
reportController.get("/instructor/reports", requireRole("instructor"), reportServices.getReportsByInstructor);
reportController.post("/feedback", requireRole("instructor"), reportServices.assignFeedbackToReport);
reportController.patch("/feedback", requireRole("instructor"), reportServices.editReportFeedback);

export default reportController;