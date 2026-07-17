import mongoose from 'mongoose';
import process from 'node:process';
import { config } from './config';

/**
 * MongoDB Database Connection
 * Establishes connection to MongoDB using Mongoose
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('✓ MongoDB connected successfully');
  } catch (_error) {
    console.error('✗ MongoDB connection error:', _error);
    process.exit(1);
  }
};

/**
 * Disconnect from Database
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected successfully');
  } catch (_error) {
    console.error('✗ MongoDB disconnection error:', _error);
  }
};

export default connectDatabase;
