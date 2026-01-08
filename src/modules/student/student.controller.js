import { Router } from 'express';
import * as studentServices from "./services/student.service.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { upload, handleUploadError } from "../../middlewares/upload.middleware.js";

const studentController = Router();

// Submit report with optional file attachments
studentController.post(
    "/submitReport",
    auth(),
    requireRole("student"),
    upload.array('attachments', 5),
    handleUploadError,
    studentServices.submitReport
);

studentController.get("/", auth(), requireRole("instructor"), studentServices.getAllStudents);
studentController.get("/reports", auth(), requireRole("student"), studentServices.getMyReports);
studentController.get("/totalScore", auth(), requireRole("student"), studentServices.getMyTotalScore);
studentController.get("/instructor", auth(), requireRole("student"), studentServices.getAssignedInstructor);

export default studentController;
