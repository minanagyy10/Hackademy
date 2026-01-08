import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { database_connection } from './db/connections.js';

import { config } from 'dotenv';
config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authController from './modules/auth/auth.controller.js';
import instructorController from './modules/instructor/instructor.controller.js';
import reportController from './modules/report/report.controller.js';
import studentController from './modules/student/student.controller.js';
import scoreController from './modules/score/score.controller.js';
import badgeController from './modules/badge/badge.controller.js';

async function bootstrap() {
    const app = express();
    const server = http.createServer(app);

    database_connection();

    //for cors bs m7tag ytzbt ba3deen
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, accessToken, refreshtoken');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });

    app.use(express.json());

    // NOTE: File uploads are served through the secure endpoint:
    // GET /api/reports/:reportId/attachments/:filename
    // This requires authentication and checks if user is the student or instructor

    app.use("/api/auth", authController);
    app.use("/api/students", studentController);
    app.use("/api/instructors", instructorController);
    app.use("/api/reports", reportController);
    app.use("/api/scores", scoreController);
    app.use("/api/badges", badgeController);

    const PORT = +process.env.PORT || 9999;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default bootstrap;

// Start the server
bootstrap();
