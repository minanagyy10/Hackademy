import { Report } from '../../../db/models/report.model.js';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Secure Attachment Download Service
 * Only allows the student who submitted the report or the assigned instructor
 * to download attachments
 */
export const getSecureAttachment = async (req, res) => {
    try {
        const { reportId, filename } = req.params;
        const userId = req.user?.id || req.user?._id;
        const userRole = req.user?.role;

        // Validate reportId
        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({ message: 'Invalid report ID' });
        }

        // Find the report
        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Authorization check: Only the student or instructor of this report can access
        const isStudent = report.student.toString() === userId.toString();
        const isInstructor = report.instructor.toString() === userId.toString();

        if (!isStudent && !isInstructor) {
            return res.status(403).json({
                message: 'Access denied. You are not authorized to view this attachment.'
            });
        }

        // Find the attachment in the report
        const attachment = report.attachments.find(att => att.filename === filename);
        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }

        // URL-encode the filename for Content-Disposition header (handles special characters)
        const encodedFilename = encodeURIComponent(attachment.originalName);

        // Set appropriate headers - Always include the proper filename
        res.setHeader('Content-Type', attachment.mimetype);

        // For inline viewing (images), still set attachment with filename for download
        // Use both filename* (RFC 5987) and filename for browser compatibility
        res.setHeader('Content-Disposition',
            `attachment; filename="${attachment.originalName}"; filename*=UTF-8''${encodedFilename}`
        );

        // STREAMING LOGIC
        if (attachment.path.startsWith('http')) {
            // It's a Cloudinary URL - fetch and pipe
            try {
                const axios = (await import('axios')).default;
                const response = await axios({
                    method: 'get',
                    url: attachment.path,
                    responseType: 'stream'
                });
                response.data.pipe(res);
            } catch (proxyError) {
                console.error('Cloudinary proxy error:', proxyError);
                return res.status(500).json({ message: 'Error retrieving file from cloud storage' });
            }
        } else {
            // It's a local file
            const filePath = path.join(__dirname, '../../../../uploads/reports', filename);

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'File not found on server' });
            }

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        }

    } catch (error) {
        console.error('Secure attachment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
