import { Student } from "../../../db/models/student.model.js";


export const leaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const topStudents = await Student.find({})
      .sort({ totalScore: -1 })
      .limit(limit)
      .select("username totalScore")
      .lean();

    return res.status(200).json({ message: 'Leaderboard retrieved successfully', topStudents });

  } catch (error) {
    console.log("Catch error from leaderboard service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
