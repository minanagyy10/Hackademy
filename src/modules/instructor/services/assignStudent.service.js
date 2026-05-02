import { Instructor } from "../../../db/models/instructor.model.js";
import { Student } from "../../../db/models/student.model.js";
import mongoose from "mongoose";

export const assignStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    // Get instructor ID from authenticated user (JWT token)
    const instructorId = req.user.id;

    // Validate required fields
    if (!studentId) {
      return res.status(400).json({ message: 'Missing required field: studentId' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid studentId format' });
    }

    // Verify instructor exists
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if student is already assigned to this instructor
    const studentIdString = studentId.toString();
    if (instructor.assignedStudents.some(id => id.toString() === studentIdString)) {
      return res.status(400).json({ message: 'Student is already assigned to this instructor' });
    }

    // Assign student to instructor
    instructor.assignedStudents.push(studentId);
    await instructor.save();

    // Populate and return
    const updatedInstructor = await Instructor.findById(instructorId)
      .populate("assignedStudents", "username email");

    return res.status(200).json({ 
      message: 'Student assigned successfully', 
      instructor: updatedInstructor 
    });

  } catch (error) {
    console.log("Catch error from assignStudent service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};