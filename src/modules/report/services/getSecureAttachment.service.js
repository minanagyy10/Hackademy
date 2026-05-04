import { Report } from "../../../db/models/report.model.js";

// Download attachment with authorization check
export const getSecureAttachment = async (req, res) => {
    try {
        const { reportId, filename } = req.params;
        const userId = req.user._id;

        // Determine role from user object or other means (assuming req.user.role exists as per role.middleware)
        // If req.user.role is not present, we fallback to checking constructor or type
        const userRole = req.user.role || (req.user.constructor.modelName === 'Student' ? 'student' : 'instructor');
        // Note: Admin might be handled differently, but auth middleware only supports Student/Instructor for now.

        const report = await Report.findById(reportId)
            .populate('student', '_id')
            .populate('instructor', '_id');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Authorization Check
        let isAuthorized = false;

        // Admins can see everything (if they pass auth middleware)
        if (userRole === 'admin') {
            isAuthorized = true;
        }
        // Students can only see their own reports
        else if (userRole === 'student') {
            if (report.student._id.toString() === userId.toString()) {
                isAuthorized = true;
            }
        }
        // Instructors can only see reports assigned to them
        else if (userRole === 'instructor') {
            // Check if this instructor is the one assigned to the report
            if (report.instructor._id.toString() === userId.toString()) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized to access this attachment' });
        }

        // Find attachment by filename
        const attachment = report.attachments.find(att => att.filename === filename);

        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }

        // Redirect to the Cloudinary URL (or secure signed URL if configured)
        // Here we just redirect to the stored path (Cloudinary URL)
        return res.redirect(attachment.path);

    } catch (error) {
        console.error("Error in getSecureAttachment:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
