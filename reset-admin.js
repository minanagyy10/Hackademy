// Quick script to reset admin password
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackademy';
const SALT = +process.env.SALT || 10;

async function resetAdminPassword() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin1@hackademy.com';
        const newPassword = 'superadmin1';

        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword, SALT);

        // Update the admin's password
        const result = await mongoose.connection.db.collection('admins').updateOne(
            { email: adminEmail },
            { $set: { password: hashedPassword } }
        );

        if (result.matchedCount === 0) {
            console.log('Admin not found with email:', adminEmail);
            console.log('Creating new admin...');

            await mongoose.connection.db.collection('admins').insertOne({
                username: 'admin1',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('Admin created successfully!');
        } else {
            console.log('Password reset successfully for:', adminEmail);
        }

        console.log('\nYou can now login with:');
        console.log('Email:', adminEmail);
        console.log('Password:', newPassword);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

resetAdminPassword();
