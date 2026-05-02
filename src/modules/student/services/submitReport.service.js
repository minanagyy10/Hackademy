import { Student } from "../../../db/models/student.model.js";
import { Instructor } from "../../../db/models/instructor.model.js";
import { createReport } from "../../report/services/report.service.js";



export const submitReport = async (req, res) => {
  try {
    const { title, level, content } = req.body;

    // Get student ID from authenticated user (JWT token)
    const studentId = req.user.id;

    // Validate required fields
    if (!title || !level || !content) {
      return res.status(400).json({ message: 'Missing required fields: title, level, and content' });
    }

    // Validate level is a number
    if (typeof level !== 'number' || level < 1) {
      return res.status(400).json({ message: 'Level must be a positive number' });
    }

    // Validate title and content are strings and not empty
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ message: 'Title must be a non-empty string' });
    }
    if (typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ message: 'Content must be a non-empty string' });
    }

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find the assigned instructor for this student
    const instructor = await Instructor.findOne({
      assignedStudents: studentId
    });

    if (!instructor) {
      return res.status(404).json({ message: 'No instructor assigned to this student' });
    }

    // Normalize request body to match createReport's expected format
    // createReport expects: { title, level, content, student, instructor }
    req.body = {
      title,
      level,
      content,
      student: studentId,
      instructor: instructor._id
    };

    // Call createReport function which handles all validation and creation
    await createReport(req, res);

  } catch (error) {
    console.log("Catch error from submitReport service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};