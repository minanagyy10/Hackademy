import { Report } from "../../../db/models/report.model.js";
import { Student } from "../../../db/models/student.model.js";
import mongoose from "mongoose";


export const getReportsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid studentId format' });
    }

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const reports = await Report.find({ student: studentId })
      .populate("student", "username email")
      .populate("instructor", "username email")
      .populate("score")
      .sort({ createdAt: -1 });

    return res.status(200).json({ message: 'Reports retrieved successfully', reports });

  } catch (error) {
    console.log("Catch error from getReportsByStudent service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};