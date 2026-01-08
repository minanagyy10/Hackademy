import bcrypt from 'bcrypt';
import { Student } from '../../../../src/db/models/student.model.js';
import { Instructor } from '../../../../src/db/models/instructor.model.js';
import { systemRoles } from '../../../../src/constants/constants.js';
import { Encryption } from '../../../../src/utils/encryption.utils.js';

export const addStudentService = async (req, res) => {
    try {
        const { username, email, password, phone, age, gender } = req.body;

        // Basic Validation (Enhance as needed)
        if (!username || !email || !password || !phone || !age) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isEmailExist = await Student.findOne({ email });
        if (isEmailExist) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const isUsernameExist = await Student.findOne({ username });
        if (isUsernameExist) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, +process.env.SALT);

        const newStudent = await Student.create({
            username,
            email,
            password: hashedPassword,
            phone: await Encryption({ value: phone, secretkey: process.env.SECRET_KEY }),
            age,
            gender,
            role: systemRoles.STUDENT
        });

        res.status(201).json({ message: "Student created successfully", student: newStudent });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const addInstructorService = async (req, res) => {
    try {
        const { username, email, password, phone, age, gender } = req.body;

        // Basic Validation
        if (!username || !email || !password || !phone || !age) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isEmailExist = await Instructor.findOne({ email });
        if (isEmailExist) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const isUsernameExist = await Instructor.findOne({ username });
        if (isUsernameExist) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, +process.env.SALT);

        const newInstructor = await Instructor.create({
            username,
            email,
            password: hashedPassword,
            phone: await Encryption({ value: phone, secretkey: process.env.SECRET_KEY }),
            age,
            gender,
            role: systemRoles.INSTRUCTOR
        });

        res.status(201).json({ message: "Instructor created successfully", instructor: newInstructor });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
