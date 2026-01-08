import express from 'express';
import dotenv from 'dotenv';
import { database_connection } from '../../src/db/connections.js';
import adminController from './modules/admin/admin.controller.js';
import registrationController from './modules/registration/registration.controller.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const port = process.env.ADMIN_PORT || 9001;

// CORS configuration for frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

app.use('/admin', adminController);
app.use('/admin/register', registrationController);

app.get('/', (req, res) => res.send('Hackademy Admin Panel API is running'));

/*
    Theoretical Connection:
    This Admin Panel is a separate backend service that connects to the SAME MongoDB database as the main Hackademy application.
    - It uses the 'Instructor' and 'Student' models (cloned logic) to insert documents directly into the 'instructors' and 'students' collections.
    - The main Hackademy application will read these documents for its own authentication (Login).
    - Authentication here is for the Admin only (using the 'Admin' collection).
*/

// Establish DB connection
database_connection();

// Local Server Listener
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Admin Panel local server listening on port ${port}`);
    });
}

// Export for Vercel
export default app;
