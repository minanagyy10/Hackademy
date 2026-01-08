import jwt from "jsonwebtoken";
import { Student } from "../db/models/student.model.js";
import { Instructor } from "../db/models/instructor.model.js";

export const auth = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;

            if (!authorization?.startsWith('Bearer')) {
                return res.status(400).json({ message: "In-valid Bearer key" }); // Typo 'In-valid' kept for consistency with Admin Panel style
            }

            const token = authorization.split(' ')[1];
            if (!token) {
                return res.status(400).json({ message: "In-valid token" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET_LOGIN);

            if (!decoded?._id || !decoded?.userType) {
                return res.status(400).json({ message: "In-valid token payload" });
            }

            // Select model based on userType from token
            let user;
            if (decoded.userType === 'student') {
                user = await Student.findById(decoded._id);
            } else if (decoded.userType === 'instructor') {
                user = await Instructor.findById(decoded._id);
            } else {
                return res.status(400).json({ message: "Unknown user type in token" });
            }

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            req.user = user;
            next();

        } catch (error) {
            return res.status(500).json({ message: "Token verification failed", error: error.message });
        }
    }
}
