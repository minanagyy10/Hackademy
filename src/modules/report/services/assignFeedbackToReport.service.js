import { Report } from "../../../db/models/report.model.js";
import { Instructor } from "../../../db/models/instructor.model.js";
import mongoose from "mongoose";


export const assignFeedbackToReport = async (req, res) => {
  try {
    const { reportId, feedback } = req.body;

    // Get instructor ID from authenticated user (JWT token)
    const instructorId = req.user.id;

    // Validate required fields
    if (!reportId || feedback === undefined) {
      return res.status(400).json({ message: 'Missing required fields: reportId and feedback' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ message: 'Invalid reportId format' });
    }

    // Validate feedback is a string
    if (typeof feedback !== 'string') {
      return res.status(400).json({ message: 'Feedback must be a string' });
    }

    // Verify report exists
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Verify instructor exists
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Verify the report belongs to this instructor
    if (report.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({ message: 'Report does not belong to this instructor' });
    }

    // Check if feedback already exists (first time feedback only)
    if (report.feedback && report.feedback.trim().length > 0) {
      return res.status(400).json({ message: 'Feedback already exists for this report. Use update feedback to modify it.' });
    }

    // Add feedback for the first time
    report.feedback = feedback.trim();
    await report.save();

    // Add to instructor's reviewedReports if not already there
    if (!instructor.reviewedReports.includes(reportId)) {
      instructor.reviewedReports.push(reportId);
      await instructor.save();
    }

    // Populate and return updated report
    const updatedReport = await Report.findById(reportId)
      .populate("student", "username email")
      .populate("instructor", "username email")
      .populate("score");

    // Emit real-time notification to student
    try {
      const { emitToUser } = await import("../../../utils/socket.js");
      emitToUser(updatedReport.student._id, "report_graded", {
        score: updatedReport.score?.score,
        reportTitle: updatedReport.title,
        feedback: feedback.trim()
      });
    } catch (socketErr) {
      console.error("Socket emission failed:", socketErr);
    }

    return res.status(201).json({ message: 'Feedback added successfully', report: updatedReport });

  } catch (error) {
    console.log("Catch error from feedbackReport service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};