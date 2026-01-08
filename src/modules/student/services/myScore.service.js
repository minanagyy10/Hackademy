import { Student } from "../../../db/models/student.model.js";



export const getMyTotalScore = async (req, res) => {
  try {
    // Get student ID from authenticated user (JWT token)
    const studentId = req.user.id;

    // Verify student exists
    const student = await Student.findById(studentId)
      .select("totalScore")
      .lean();

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const totalScore = student.totalScore || 0;

    return res.status(200).json({ message: 'Total score retrieved successfully', totalScore });

  } catch (error) {
    console.log("Catch error from getMyTotalScore service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};