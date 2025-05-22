const mongoose = require('mongoose');
const config = require('../config');

// Connect to MongoDB
const connectDB = async () => {

  // Get MongoDB connection string from environment variables
  const MONGODB_URI = config.MONGODB_URI;

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;