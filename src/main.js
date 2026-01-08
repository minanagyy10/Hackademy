import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { database_connection } from './db/connections.js';

// Import Controllers
import authController from './modules/auth/auth.controller.js';
import instructorController from './modules/instructor/instructor.controller.js';
import reportController from './modules/report/report.controller.js';
import studentController from './modules/student/student.controller.js';
import scoreController from './modules/score/score.controller.js';
import badgeController from './modules/badge/badge.controller.js';

// 1. Initial configuration
config();
const app = express();

// 2. Setup environment constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3. Establish Database Connection
// Mongoose handles request buffering, so it's safe to start this here
database_connection();

// 4. Global Middleware
app.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:5173',
        'https://hackademy-frontend.vercel.app',
        process.env.FRONTEND_URL,
    ].filter(Boolean);

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, accessToken, refreshtoken');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. API Routes
app.use("/api/auth", authController);
app.use("/api/students", studentController);
app.use("/api/instructors", instructorController);
app.use("/api/reports", reportController);
app.use("/api/scores", scoreController);
app.use("/api/badges", badgeController);

// Status Route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Hackademy Backend API is fully operational 🚀',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

// 7. Starter for Local Development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 9999;
    app.listen(PORT, () => {
        console.log(`[Local Server] Running at http://localhost:${PORT}`);
    });
}

// 8. Export for Vercel Serverless
export default app;
