import { Router } from 'express';
import * as registrationService from './registration.service.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { systemRoles } from '../../../../src/constants/constants.js';

const registrationController = Router();

// Only Admin can register users
registrationController.post('/instructor', auth([systemRoles.ADMIN]), registrationService.addInstructorService);
registrationController.post('/student', auth([systemRoles.ADMIN]), registrationService.addStudentService);

export default registrationController;
