import { submitReport } from './submitReport.service.js';
import { getAssignedInstructor } from './myInstructor.service.js';
import { getMyReports } from './myReports.service.js';
import { getMyTotalScore } from './myScore.service.js';
import { updatePasswordService, updateProfileService } from './profile.service.js';
import { getAllStudents } from './getAllStudents.service.js';

export {
  submitReport,
  getAssignedInstructor,
  getMyReports,
  getMyTotalScore,
  updatePasswordService,
  updateProfileService,
  getAllStudents
};

