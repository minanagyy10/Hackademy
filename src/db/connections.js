import mongoose from "mongoose";

let lastError = null;

export const database_connection = async () => {
    try {
        if (!process.env.DB_URL) {
            console.error("[DB] No DB_URL provided in environment");
            return;
        }
        await mongoose.connect(process.env.DB_URL, {
            serverSelectionTimeoutMS: 5000,
        });
        lastError = null;
        console.log("[DB] MongoDB connected successfully ✅");
    } catch (error) {
        lastError = error.message;
        console.error("[DB] Connection error details:", {
            name: error.name,
            message: error.message,
            code: error.code
        });
    }
};

export { mongoose, lastError };
