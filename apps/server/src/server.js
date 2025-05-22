const config = require('./config');
const express = require('express');
const cors = require('cors');
const asyncHandler = require('express-async-handler');
const connectDB = require('./db/connection');
const errorsMiddleware = require('./middleware/errors.middleware');
const mongoose = require('mongoose');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

//import routes
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your client application URL
  credentials: true // Allow credentials (cookies)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

// Configure session management
app.use(session({
  secret: config.SECRET || 'this should be a secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: config.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  store: MongoStore.create({
    mongoUrl: config.MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Sample route with async handler
app.get('/', asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
}));

// Health check endpoint with async handler
app.get('/health', asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'ok' });
}));

//////// Routes

// auth
app.use('/auth', authRouter);

// posts
app.use('/api/posts', postsRouter);

// 404 handler for undefined routes (should be after all routes)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorsMiddleware);

// Start the serverx
const PORT = config.PORT;
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
