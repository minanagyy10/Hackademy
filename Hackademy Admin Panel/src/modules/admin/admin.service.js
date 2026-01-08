import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admin } from '../../db/models/admin.model.js';
import { Student } from '../../../../src/db/models/student.model.js';
import { Instructor } from '../../../../src/db/models/instructor.model.js';
import { Report } from '../../../../src/db/models/report.model.js';
import { Score } from '../../../../src/db/models/score.model.js';

export const signUpService = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const isEmailExist = await Admin.findOne({ email });
        if (isEmailExist) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const hashedPassword = bcrypt.hashSync(password, +process.env.SALT);
        const admin = await Admin.create({
            username,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: "Admin created", admin });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const logInService = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Invalid email or password" });
        }
        const isMatch = bcrypt.compareSync(password, admin.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, process.env.JWT_SECRET_LOGIN, { expiresIn: '1d' });
        res.status(200).json({ message: "Login success", token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

/**
 * Get Admin Dashboard Stats
 * Returns real counts from MongoDB
 */
export const getStats = async (req, res) => {
    try {
        const [totalStudents, totalInstructors, totalReports] = await Promise.all([
            Student.countDocuments({ isDeactivated: false }),
            Instructor.countDocuments({ isDeactivated: false }),
            Report.countDocuments()
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalStudents,
                totalInstructors,
                totalReports
            }
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats"
        });
    }
};

/**
 * Get Analytics Data
 * Returns aggregated data for charts
 */
export const getAnalytics = async (req, res) => {
    try {
        // Get reports activity (submissions per day for last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const reportsActivity = await Report.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $project: {
                    date: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // Get student level distribution (based on report levels)
        const levelDistribution = await Report.aggregate([
            {
                $group: {
                    _id: "$level",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    level: "$_id",
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { level: 1 }
            }
        ]);

        // Get grading stats (graded vs ungraded)
        const [gradedCount, ungradedCount] = await Promise.all([
            Report.countDocuments({ score: { $exists: true, $ne: null } }),
            Report.countDocuments({ $or: [{ score: null }, { score: { $exists: false } }] })
        ]);

        // Get average score
        const scoreStats = await Score.aggregate([
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: "$score" },
                    totalScores: { $sum: 1 }
                }
            }
        ]);

        const averageScore = scoreStats.length > 0 ? Math.round(scoreStats[0].avgScore) : 0;

        return res.status(200).json({
            success: true,
            data: {
                reportsActivity,
                levelDistribution,
                gradingStats: {
                    graded: gradedCount,
                    ungraded: ungradedCount
                },
                averageScore
            }
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch analytics data"
        });
    }
};

/**
 * Get All Users (Students and Instructors)
 */
export const getAllUsers = async (req, res) => {
    try {
        const [students, instructors] = await Promise.all([
            Student.find({ isDeactivated: false })
                .select('_id username email phone age role createdAt totalScore')
                .lean(),
            Instructor.find({ isDeactivated: false })
                .select('_id username email phone age role createdAt assignedStudents')
                .lean()
        ]);

        // Add user type to each user
        const formattedStudents = students.map(s => ({
            ...s,
            userType: 'student',
            assignedStudentsCount: 0
        }));

        const formattedInstructors = instructors.map(i => ({
            ...i,
            userType: 'instructor',
            assignedStudentsCount: i.assignedStudents?.length || 0,
            totalScore: null
        }));

        const allUsers = [...formattedStudents, ...formattedInstructors];

        return res.status(200).json({
            success: true,
            data: allUsers
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

/**
 * Delete a User (Student or Instructor)
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { userType } = req.query; // 'student' or 'instructor'

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        let deletedUser = null;

        if (userType === 'instructor') {
            // Also unassign students before deleting
            deletedUser = await Instructor.findByIdAndDelete(id);
        } else {
            // Also remove from instructor's assignedStudents
            await Instructor.updateMany(
                { assignedStudents: id },
                { $pull: { assignedStudents: id } }
            );
            deletedUser = await Student.findByIdAndDelete(id);
        }

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};
