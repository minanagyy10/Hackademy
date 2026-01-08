import { Router } from 'express';
import * as reportServices from './services/report.service.js';
import { requireRole } from "../../middlewares/role.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { upload, handleUploadError } from "../../middlewares/upload.middleware.js";

const reportController = Router();

// Create report with optional file attachments (Students only)
// Uses Multer middleware to handle multipart/form-data
reportController.post(
    "/",
    auth(),
    requireRole("student"),
    upload.array('attachments', 5),
    handleUploadError,
    reportServices.createReport
);

// Get single report by ID (includes attachments and comments)
reportController.get("/:reportId", reportServices.getReportById);

// Get reports by student ID
reportController.get("/student/:studentId", reportServices.getReportsByStudent);

// Get reports assigned to instructor (Instructor only)
reportController.get(
    "/instructor/reports",
    auth(),
    requireRole("instructor"),
    reportServices.getReportsByInstructor
);

// Add feedback to report (Instructor only - legacy single feedback)
reportController.post(
    "/feedback",
    auth(),
    requireRole("instructor"),
    reportServices.assignFeedbackToReport
);

// Edit feedback on report (Instructor only)
reportController.patch(
    "/feedback",
    auth(),
    requireRole("instructor"),
    reportServices.editReportFeedback
);

// === NEW: Comment/Discussion Thread Routes ===

// Add comment to a report (Student or Instructor)
reportController.post(
    "/:reportId/comments",
    auth(),
    reportServices.addComment
);

// Get all comments for a report (Student or Instructor)
reportController.get(
    "/:reportId/comments",
    auth(),
    reportServices.getReportComments
);

// === SECURE ATTACHMENT DOWNLOAD ===
// Download attachment with authorization check (Student or Instructor of the report only)
reportController.get(
    "/:reportId/attachments/:filename",
    auth(),
    reportServices.getSecureAttachment
);

export default reportController;
