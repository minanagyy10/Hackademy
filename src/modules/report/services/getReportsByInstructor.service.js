import { Report } from "../../../db/models/report.model.js";
import { Instructor } from "../../../db/models/instructor.model.js";
import mongoose from "mongoose";


export const getReportsByInstructor = async (req, res) => {
  try {
    // Get instructorId from params or from authenticated user
    const instructorId = req.params.instructorId || req.user?.id;

    if (!instructorId) {
      return res.status(400).json({ message: 'Missing instructorId' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({ message: 'Invalid instructorId format' });
    }

    // Verify instructor exists
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const reports = await Report.find({ instructor: instructorId })
      .populate("student", "username email")
      .populate("instructor", "username email")
      .populate("score")
      .sort({ createdAt: -1 });

    return res.status(200).json({ message: 'Reports retrieved successfully', reports });

  } catch (error) {
    console.log("Catch error from getReportsByInstructor service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};