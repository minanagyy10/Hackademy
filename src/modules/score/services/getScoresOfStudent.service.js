import { Score } from "../../../db/models/score.model.js";
import { Student } from "../../../db/models/student.model.js";



export const getScoresOfStudent = async (req, res) => {
  try {
    // Get student ID from authenticated user (JWT token)
    // This function is called by students to see their own scores
    const studentId = req.user.id;

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const scores = await Score.find({ student: studentId })
      .populate("report", "title level status")
      .populate("instructor", "username email")
      .sort({ reviewedAt: -1 });

    return res.status(200).json({ message: 'Scores retrieved successfully', scores });

  } catch (error) {
    console.log("Catch error from getScoresByStudent service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};