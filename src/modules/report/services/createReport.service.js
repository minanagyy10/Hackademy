import { Report } from "../../../db/models/report.model.js";
import { Student } from "../../../db/models/student.model.js";
import { Instructor } from "../../../db/models/instructor.model.js";
import mongoose from "mongoose";



export const createReport = async (req, res) => {
  try {
    const { title, level, content, student, instructor } = req.body;

    // Validate required fields
    if (!title || !level || !content || !student || !instructor) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(student)) {
      return res.status(400).json({ message: 'Invalid studentId format' });
    }
    if (!mongoose.Types.ObjectId.isValid(instructor)) {
      return res.status(400).json({ message: 'Invalid instructorId format' });
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
    const studentDoc = await Student.findById(student);
    if (!studentDoc) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify instructor exists
    const instructorDoc = await Instructor.findById(instructor);
    if (!instructorDoc) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Verify that the student is assigned for the instructor
    const studentIdString = student.toString();
    if (!instructorDoc.assignedStudents.some(id => id.toString() === studentIdString)) {
      return res.status(404).json({ message: 'Student is not assigned to this instructor' });
    }

    // Create and save the report
    const report = new Report({
      title: title.trim(),
      level: level.toString(), // Convert to string as model expects string
      content: content.trim(),
      student,
      instructor
    });

    await report.save();

    // Add report to student's reports array
    studentDoc.reports.push(report._id);
    await studentDoc.save();

    // Populate and return
    const populatedReport = await Report.findById(report._id)
      .populate("student", "username email")
      .populate("instructor", "username email");

    return res.status(201).json({ message: 'Report created successfully', report: populatedReport });

  } catch (error) {
    console.log("Catch error from createReport service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};