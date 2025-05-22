const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Initialize passport configuration
authController.configurePassport();

// Login route
router.get('/login', authController.login);

// OAuth2 callback route
router.get('/oauth2/redirect', authController.oauthCallback);

// Logout route
router.get('/logout', authController.logout);

// User profile route - protected route example
router.get('/profile', authController.isAuthenticated, authController.getProfile);

module.exports = router;