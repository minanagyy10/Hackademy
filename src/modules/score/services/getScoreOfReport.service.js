import { Score } from "../../../db/models/score.model.js";
import { Report } from "../../../db/models/report.model.js";
import mongoose from "mongoose";


export const getScoreOfReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ message: 'Invalid reportId format' });
    }

    // Verify report exists
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const score = await Score.findOne({ report: reportId })
      .populate("report", "title level content status")
      .populate("student", "username email")
      .populate("instructor", "username email");

    if (!score) {
      return res.status(404).json({ message: 'Score not found for this report' });
    }

    return res.status(200).json({ message: 'Score retrieved successfully', score });

  } catch (error) {
    console.log("Catch error from getScoreByReport service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
