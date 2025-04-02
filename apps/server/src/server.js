const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const asyncHandler = require('express-async-handler');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route with async handler
app.get('/', asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
}));

// Health check endpoint with async handler
app.get('/health', asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'ok' });
}));

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Determine appropriate status code
  const statusCode = err.statusCode || 500;
  
  // Send appropriate response based on environment
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : {
      stack: err.stack,
      details: err
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export for testing purposes
