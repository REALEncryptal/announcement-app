const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const asyncHandler = require('express-async-handler');
const connectDB = require('./db/connection');
const errorsMiddleware = require('./middleware/errors.middleware');
const announcementsRoutes = require('./routes/announcements.routes');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

console.log(process.env.MONGODB_URI); 

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api/announcements', announcementsRoutes);

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
app.use(errorsMiddleware);

// Start the serverx
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown handling
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

function gracefulShutdown() {
  console.log('Received shutdown signal, closing connections...');
  
  server.close(() => {
    console.log('HTTP server closed');
    
    // Close MongoDB connection
    mongoose.connection.close(false)
      .then(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
      });
  });
  
  // Force shutdown after 10 seconds if connections haven't closed
  setTimeout(() => {
    console.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
}

module.exports = app; // Export for testing purposes
