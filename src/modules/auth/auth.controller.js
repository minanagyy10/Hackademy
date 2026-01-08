import {Router} from 'express';
import * as authServices from './services/athentication.service.js';

const authController = Router();

//authController.post('/signup', authServices.signUpService);
authController.post('/login', authServices.logInService);
//authController.post('/refresh-token', authServices.refreshTokenService);
authController.post("/logout", authServices.logOutService);

//authController.patch("/forget-password", authServices.forgetPasswordService); // Patch because we apdate just one thing
//authController.put("/reset-password", authServices.resetPasswordService);




export default authController; 