import { Instructor } from "../../../db/models/instructor.model.js";


export const getAssignedStudents = async (req, res) => {
  try {
    // Get instructor ID from authenticated user (JWT token)
    const instructorId = req.user.id;

    // Verify instructor exists
    const instructor = await Instructor.findById(instructorId)
      .populate("assignedStudents", "username email totalScore");

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    return res.status(200).json({ 
      message: 'Assigned students retrieved successfully', 
      students: instructor.assignedStudents 
    });

  } catch (error) {
    console.log("Catch error from getAssignedStudents service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
