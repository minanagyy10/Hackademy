import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

// Use test database
const TEST_DB_URL = process.env.TEST_DB_URL || process.env.DB_URL || 'mongodb://localhost:27017/hackademy_test';

let connection;

export const connectTestDB = async () => {
  try {
    connection = await mongoose.connect(TEST_DB_URL);
    console.log('Test database connected');
  } catch (error) {
    console.error('Error connecting to test database:', error);
    throw error;
  }
};

export const disconnectTestDB = async () => {
  try {
    if (connection) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      console.log('Test database disconnected');
    }
  } catch (error) {
    console.error('Error disconnecting from test database:', error);
    throw error;
  }
};

export const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

