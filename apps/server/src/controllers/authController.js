const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const User = require('../models/user');

// Configure Passport.js
const configurePassport = () => {
  // Serialize user to the session
  passport.serializeUser(function(user, done) {
    done(null, user.id || user._id);
  });

  // Deserialize user from the session
  passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });

  // Configure Auth0 strategy
  const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL || '/auth/oauth2/redirect',
      state: true,
      passReqToCallback: true
    },
    verifyCallback
  );

  passport.use(strategy);
};

// Verification callback for Auth0
const verifyCallback = async function(req, accessToken, refreshToken, extraParams, profile, done) {
  try {
    // Prepare auth profile data for our User model
    const authProfile = {
      id: profile.id,
      displayName: profile.displayName,
      emails: profile.emails,
      photos: profile.photos,
      provider: 'auth0'
    };
    
    // Find or create user in our database
    const user = await User.findOrCreateFromAuth(authProfile);
    
    // Update tokens if needed
    if (refreshToken && user.refreshToken !== refreshToken) {
      user.refreshToken = refreshToken;
      await user.save();
    }
    
    return done(null, user);
  } catch (err) {
    console.error('Error during authentication:', err);
    return done(err);
  }
};



// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Controller methods
const login = (req, res, next) => {
  passport.authenticate('auth0', {
    scope: 'openid email profile'
  })(req, res, next);
};

const oauthCallback = (req, res, next) => {
  // Get the client URL from config
  const config = require('../config');
  const clientUrl = config.CLIENT_URL;
  
  passport.authenticate('auth0', {
    successRedirect: clientUrl,
    failureRedirect: clientUrl
  })(req, res, next);
};

const logout = (req, res, next) => {
  // Perform local logout
  req.logout(function(err) {
    if (err) { return next(err); }
    
    // Get the client URL from config
    const config = require('../config');
    const clientUrl = config.CLIENT_URL;
    
    // After local logout, redirect to Auth0 logout to end the Auth0 session
    const returnTo = encodeURIComponent(clientUrl);
    
    // Build the Auth0 logout URL according to Auth0 docs
    const logoutURL = `https://${process.env.AUTH0_DOMAIN}/v2/logout?` +
      `client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${returnTo}`;
    
    console.log('Redirecting to Auth0 logout URL:', logoutURL);
    res.redirect(logoutURL);
  });
};

const getProfile = (req, res) => {
  res.json({ user: req.user });
};

module.exports = {
  configurePassport,
  isAuthenticated,
  login,
  oauthCallback,
  logout,
  getProfile
};
