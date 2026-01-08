import { Student } from "../../../db/models/student.model.js";

export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({}, '_id username email');
        res.status(200).json({
            message: "Students fetched successfully",
            students
        });
    } catch (error) {
        console.error("Error in getAllStudents service:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
