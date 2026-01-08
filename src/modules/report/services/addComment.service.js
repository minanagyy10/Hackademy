import { Report } from "../../../db/models/report.model.js";
import { Student } from "../../../db/models/student.model.js";
import { Instructor } from "../../../db/models/instructor.model.js";
import mongoose from "mongoose";

/**
 * Add a comment to a report's discussion thread
 * Both students and instructors can add comments to reports they're associated with
 */
export const addComment = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { content } = req.body;
        const user = req.user;

        // Validate reportId
        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({ message: 'Invalid reportId format' });
        }

        // Validate content
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        if (content.length > 2000) {
            return res.status(400).json({ message: 'Comment must be at most 2000 characters' });
        }

        // Find the report
        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Determine user role and verify access
        let authorRole, authorModel, authorName;
        const userId = user._id.toString();

        if (report.student.toString() === userId) {
            // User is the student who submitted this report
            authorRole = 'student';
            authorModel = 'Student';
            authorName = user.username;
        } else if (report.instructor.toString() === userId) {
            // User is the instructor assigned to this report
            authorRole = 'instructor';
            authorModel = 'Instructor';
            authorName = user.username;
        } else {
            return res.status(403).json({
                message: 'You can only comment on reports you are associated with'
            });
        }

        // Create the comment object
        const newComment = {
            author: user._id,
            authorModel,
            authorRole,
            authorName,
            content: content.trim(),
            createdAt: new Date()
        };

        // Add comment to report using $push for atomicity
        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { $push: { comments: newComment } },
            { new: true }
        )
            .populate('student', 'username email')
            .populate('instructor', 'username email');

        // Get the newly added comment (last one in array)
        const addedComment = updatedReport.comments[updatedReport.comments.length - 1];

        // Emit real-time notification to the other party
        try {
            const { emitToUser } = await import("../../../utils/socket.js");
            const recipientId = authorRole === 'student'
                ? report.instructor.toString()
                : report.student.toString();

            emitToUser(recipientId, "new_comment", {
                reportId: report._id,
                reportTitle: report.title,
                authorName,
                authorRole,
                commentPreview: content.substring(0, 100)
            });
        } catch (socketErr) {
            console.error("Socket emission failed:", socketErr);
        }

        // Gamification: Update stats and check for badges if instructor commented
        if (authorRole === 'instructor') {
            try {
                const { updateStatsOnInstructorComment, checkAndAwardBadges } = await import("../../../utils/badgeSystem.js");
                const studentId = report.student.toString();
                await updateStatsOnInstructorComment(studentId);
                await checkAndAwardBadges(studentId, 'instructor_comment');
            } catch (badgeErr) {
                console.error("Badge award failed:", badgeErr);
            }
        }

        return res.status(201).json({
            message: 'Comment added successfully',
            comment: addedComment,
            totalComments: updatedReport.comments.length
        });

    } catch (error) {
        console.log("Catch error from addComment service", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

/**
 * Get all comments for a report
 */
export const getReportComments = async (req, res) => {
    try {
        const { reportId } = req.params;
        const user = req.user;

        // Validate reportId
        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({ message: 'Invalid reportId format' });
        }

        // Find the report
        const report = await Report.findById(reportId)
            .select('comments student instructor')
            .populate('student', 'username')
            .populate('instructor', 'username');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Verify access - only student or instructor of this report
        const userId = user._id.toString();
        if (report.student._id.toString() !== userId &&
            report.instructor._id.toString() !== userId) {
            return res.status(403).json({
                message: 'You can only view comments on reports you are associated with'
            });
        }

        // Return comments sorted by date (oldest first for chat display)
        const sortedComments = report.comments.sort((a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
        );

        return res.status(200).json({
            comments: sortedComments,
            totalComments: sortedComments.length
        });

    } catch (error) {
        console.log("Catch error from getReportComments service", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
