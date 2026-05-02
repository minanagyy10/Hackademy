import { Score } from "../../../db/models/score.model.js";
import { Student } from "../../../db/models/student.model.js";
import { Report } from "../../../db/models/report.model.js";
import { Instructor } from "../../../db/models/instructor.model.js";
import mongoose from "mongoose";

export const assignScoreToReport = async (req, res) => {
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

    // Get studentId from report relationship
    const studentId = report.student;

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify instructor exists
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Check if score already exists for this report
    const existingScore = await Score.findOne({ report: reportId });
    if (existingScore) {
      return res.status(400).json({ message: 'Score already exists for this report' });
    }

    // Verify the report belongs to this instructor
    if (report.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({ message: 'Report does not belong to this instructor' });
    }

    // Create the score
    const score = new Score({
      report: reportId,
      instructor: instructorId,
      student: studentId,
      score: scoreValue
    });

    await score.save();

    // Update report: link score (reviewing is done by scoring)
    student.totalScore = (student.totalScore || 0) + scoreValue;
    student.scores.push(score._id);
    await student.save();

    // Update report: link score
    report.score = score._id;
    await report.save();

    // Update instructor: add to givenScores and reviewedReports
    instructor.givenScores.push(score._id);
    if (!instructor.reviewedReports.includes(reportId)) {
      instructor.reviewedReports.push(reportId);
    }
    await instructor.save();

    // Populate and return
    const populatedScore = await Score.findById(score._id)
      .populate("report", "title level")
      .populate("student", "username email")
      .populate("instructor", "username email");

    return res.status(201).json({ message: 'Score assigned successfully', score: populatedScore });

  } catch (error) {
    console.log("Catch error from assignScoreToReport service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};