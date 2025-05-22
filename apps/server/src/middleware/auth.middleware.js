/**
 * Authentication Middleware
 * 
 * A collection of middleware functions for protecting routes
 * and verifying user authentication status.
 */

/**
 * Verifies that a user is authenticated
 * If not authenticated, returns 401 Unauthorized
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ 
    success: false, 
    message: 'Unauthorized - Authentication required' 
  });
};

/**
 * Verifies that a user is NOT authenticated
 * Useful for routes like login, register that should only be accessible to guests
 * If authenticated, redirects to home
 */
const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.status(403).json({ 
    success: false, 
    message: 'You are already authenticated' 
  });
};

/**
 * Verifies that the authenticated user has admin role
 * Requires isAuthenticated to be called first
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized - Authentication required' 
    });
  }
  
  if (req.user.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({ 
    success: false, 
    message: 'Forbidden - Admin access required' 
  });
};



/**
 * Attaches the current user to the request if they are authenticated
 * Allows routes to be accessible to both authenticated and non-authenticated users
 * while still having access to the user object if they are authenticated
 */
const attachUser = (req, res, next) => {
  // User is already attached by Passport if authenticated
  next();
};

/**
 * Ensures the user has a valid refresh token
 * Can be used for routes that require a recent authentication
 */
const hasValidRefreshToken = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized - Authentication required' 
    });
  }
  
  if (!req.user.refreshToken) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized - Valid refresh token required' 
    });
  }
  
  // Here you would typically validate if the refresh token is still valid
  // This would involve checking against your database or auth provider
  
  next();
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
  attachUser,
  hasValidRefreshToken
};
