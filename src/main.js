import express from 'express';
import {database_connection} from '../src/db/connections.js';

import { config } from 'dotenv';
config();

import authController from './modules/auth/auth.controller.js';
import instructorController from './modules/instructor/instructor.controller.js';
import reportController from './modules/report/report.controller.js';
import studentController from './modules/student/student.controller.js';
import scoreController from './modules/score/score.controller.js';


async function bootstrap() {
    const app = express();
    
    database_connection();

    app.use(express.json());// Body parser

    app.use("/api/auth", authController);
    app.use("/api/students", studentController);
    app.use("/api/instructors", instructorController);
    app.use("/api/reports", reportController);
    app.use("/api/scores", scoreController);


    app.listen(+process.env.PORT, ()=>{
        console.log("Server is running on port 9000");        
    });
}




export default bootstrap;