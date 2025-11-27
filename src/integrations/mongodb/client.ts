import mongoose from 'mongoose';

// MongoDB connection string from environment variable
// Use process.env for Node.js backend, import.meta.env for frontend
let MONGODB_URI: string;
if (typeof process !== 'undefined' && process.env?.MONGODB_URI) {
  MONGODB_URI = process.env.MONGODB_URI;
} else if (typeof import !== 'undefined' && import.meta?.env?.VITE_MONGODB_URI) {
  MONGODB_URI = import.meta.env.VITE_MONGODB_URI;
} else {
  MONGODB_URI = 'mongodb://localhost:27017/readwise_litbot';
}

// If MONGODB_URI doesn't include a database name, append /readwise_litbot
if (MONGODB_URI && !MONGODB_URI.match(/\/[^\/]+$/)) {
  MONGODB_URI = MONGODB_URI.replace(/\/$/, '') + '/readwise_litbot';
}

export const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};
