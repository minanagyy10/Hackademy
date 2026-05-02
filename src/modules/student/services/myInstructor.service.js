import { Student } from "../../../db/models/student.model.js";
import { Instructor } from "../../../db/models/instructor.model.js";


export const getAssignedInstructor = async (req, res) => {
  try {
    // Get student ID from authenticated user (JWT token)
    const studentId = req.user.id;

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find instructor who has this student in assignedStudents
    const instructor = await Instructor.findOne({
      assignedStudents: studentId
    }).select("username email phone profilePicture");

    if (!instructor) {
      return res.status(404).json({ message: 'No instructor assigned to this student' });
    }

    return res.status(200).json({ message: 'Assigned instructor retrieved successfully', instructor });

  } catch (error) {
    console.log("Catch error from getAssignedInstructor service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
