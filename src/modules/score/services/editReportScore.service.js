import { Score } from "../../../db/models/score.model.js";
import { Student } from "../../../db/models/student.model.js";
import { Report } from "../../../db/models/report.model.js";
import { Instructor } from "../../../db/models/instructor.model.js";
import mongoose from "mongoose";


export const editReportScore = async (req, res) => {
  try {
    const { reportId, scoreValue } = req.body;

    // Get instructor ID from authenticated user (JWT token)
    const instructorId = req.user.id;

    // Validate required fields
    if (!reportId || scoreValue === undefined) {
      return res.status(400).json({ message: 'Missing required fields: reportId and scoreValue' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ message: 'Invalid reportId format' });
    }

    // Validate score value (0-100)
    if (typeof scoreValue !== 'number' || scoreValue < 0 || scoreValue > 100) {
      return res.status(400).json({ message: 'Score must be a number between 0 and 100' });
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

    // Find the existing score
    const existingScore = await Score.findOne({ report: reportId });
    if (!existingScore) {
      return res.status(404).json({ message: 'Score not found for this report' });
    }

    // Verify the score belongs to this instructor
    if (existingScore.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this score' });
    }

    // Get the student to update totalScore
    const student = await Student.findById(existingScore.student);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Calculate the difference and update score
    const scoreDifference = scoreValue - existingScore.score;
    existingScore.score = scoreValue;
    await existingScore.save();

    // Update student's totalScore if score changed
    if (scoreDifference !== 0) {
      student.totalScore = (student.totalScore || 0) + scoreDifference;
      await student.save();
    }

    // Populate and return updated score
    const updatedScore = await Score.findById(existingScore._id)
      .populate("report", "title level")
      .populate("student", "username email")
      .populate("instructor", "username email");

    // Emit real-time notification to student
    try {
      const { emitToUser } = await import("../../../utils/socket.js");
      emitToUser(updatedScore.student._id, "report_graded", {
        score: scoreValue,
        reportTitle: updatedScore.report.title,
        feedback: "Your report score has been updated."
      });
    } catch (socketErr) {
      console.error("Socket emission failed:", socketErr);
    }

    return res.status(200).json({ message: 'Score updated successfully', score: updatedScore });

  } catch (error) {
    console.log("Catch error from editScore service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};