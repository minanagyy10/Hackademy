import { Router } from 'express';
import * as adminService from './admin.service.js';

const adminController = Router();

// Auth routes
adminController.post('/signup', adminService.signUpService); // Keep for initial setup
adminController.post('/login', adminService.logInService);

// Dashboard data routes
adminController.get('/stats', adminService.getStats);
adminController.get('/analytics', adminService.getAnalytics);

// User management routes
adminController.get('/users', adminService.getAllUsers);
adminController.delete('/users/:id', adminService.deleteUser);

export default adminController;
