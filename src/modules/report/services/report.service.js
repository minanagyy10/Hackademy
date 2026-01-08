import { createReport } from './createReport.service.js';
import { getReportById } from './getReportByID.service.js';
import { getReportsByStudent } from './getReportsByStudent.service.js';
import { getReportsByInstructor } from './getReportsByInstructor.service.js';
import { assignFeedbackToReport } from './assignFeedbackToReport.service.js'
import { editReportFeedback } from './editReportFeedback.service.js';
import { addComment, getReportComments } from './addComment.service.js';
import { getSecureAttachment } from './getSecureAttachment.service.js';


export {
  createReport,
  getReportById,
  getReportsByStudent,
  getReportsByInstructor,
  assignFeedbackToReport,
  editReportFeedback,
  addComment,
  getReportComments,
  getSecureAttachment
};
