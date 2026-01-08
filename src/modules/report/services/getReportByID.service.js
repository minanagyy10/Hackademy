import { Report } from "../../../db/models/report.model.js";
import mongoose from "mongoose";


export const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ message: 'Invalid reportId format' });
    }

    // Verify report exists and populate all related data
    const report = await Report.findById(reportId)
      .populate("student", "username email")
      .populate("instructor", "username email")
      .populate("score")
      .lean(); // Use lean for better performance

    // Sort comments by date (oldest first for chat display)
    if (report && report.comments) {
      report.comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    return res.status(200).json({ message: 'Report retrieved successfully', report });

  } catch (error) {
    console.log("Catch error from getReportById service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};