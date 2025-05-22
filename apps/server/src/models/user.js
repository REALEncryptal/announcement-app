const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User Schema
 * Minimal user model with only essential fields
 */
const UserSchema = new Schema({
  // Main content

  // Authentication and User Data
  // User identifier from Auth0 or other auth provider
  providerId: {
    type: String,
    required: true,
    unique: true
  },
  // Auth provider (e.g. 'auth0', 'google', etc.)
  provider: {
    type: String,
    required: true
  },
  // Username
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // User's display name
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  // User's Bio
  bio: {
    type: String,
    trim: true,
    default: 'A new mused user'
  },
  // User's Posts
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  // Recently viewed posts
  recentlyViewedPosts: [{
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // User's Followers
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // User's Following
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Posts liked by user
  likedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  // User's Avatar
  avatar: {
    type: String,
    trim: true,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  },
  // User's email address
  email: {
    type: String,
    required: true,
    unique: true
  },
  // Refresh token for auth if needed
  refreshToken: String,
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Add timestamps for createdAt and updatedAt
  timestamps: true
});

// Static method to find a user by their provider ID
UserSchema.statics.findByProviderId = function(providerId) {
  return this.findOne({ providerId });
};

// Static method to find or create a user based on auth provider data
// Add a post to user's recently viewed posts
UserSchema.methods.addToRecentlyViewed = async function(postId) {
  // Check if post already exists in recently viewed
  const existingIndex = this.recentlyViewedPosts.findIndex(
    item => item.postId.toString() === postId.toString()
  );

  // If exists, remove it so we can add it to the front (most recent)
  if (existingIndex !== -1) {
    this.recentlyViewedPosts.splice(existingIndex, 1);
  }

  // Add post to the front of the array with current timestamp
  this.recentlyViewedPosts.unshift({
    postId: postId,
    viewedAt: new Date()
  });

  // Limit to most recent 20 posts
  if (this.recentlyViewedPosts.length > 20) {
    this.recentlyViewedPosts = this.recentlyViewedPosts.slice(0, 20);
  }

  return this.save();
};

// Get user's recently viewed posts
UserSchema.methods.getRecentlyViewed = async function(limit = 10) {
  // Populate the post data
  await this.populate({
    path: 'recentlyViewedPosts.postId',
    model: 'Post',
    select: '-__v' // Exclude version field
  });

  // Return limited number of recently viewed posts
  return this.recentlyViewedPosts
    .slice(0, limit)
    .map(item => ({
      post: item.postId,
      viewedAt: item.viewedAt
    }));
};

// Toggle like for a post (add or remove from likedPosts)
UserSchema.methods.toggleLike = async function(postId) {
  // Check if post already exists in liked posts
  const existingIndex = this.likedPosts.findIndex(
    id => id.toString() === postId.toString()
  );

  let action = ''; // Track the action taken

  if (existingIndex === -1) {
    // Add post to liked posts if not already there
    this.likedPosts.push(postId);
    action = 'added';
  } else {
    // Remove post from liked posts if already there
    this.likedPosts.splice(existingIndex, 1);
    action = 'removed';
  }

  await this.save();
  return { action };
};

// Get user's liked posts
UserSchema.methods.getLikedPosts = async function(limit = 10, skip = 0) {
  // Populate the post data
  await this.populate({
    path: 'likedPosts',
    model: 'Post',
    options: {
      limit,
      skip,
      sort: { createdAt: -1 }
    },
    populate: {
      path: 'userId',
      model: 'User',
      select: 'username displayName avatar'
    }
  });

  return this.likedPosts;
};

UserSchema.statics.findOrCreateFromAuth = async function(authProfile) {
  // Look for existing user
  let user = await this.findOne({ providerId: authProfile.id });
  
  // If user exists, return it
  if (user) {
    return user;
  }
  
  // Extract email address
  const email = authProfile.emails && authProfile.emails[0] ? authProfile.emails[0].value : '';
  
  // Extract the part before @ for username and display name
  let baseUsername = '';
  let displayName = 'User';
  
  if (email && email.includes('@')) {
    baseUsername = email.split('@')[0].toLowerCase().trim();
    // Capitalize first letter of each word for display name
    displayName = baseUsername
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } else if (authProfile.displayName) {
    // Fallback to auth profile display name if available
    baseUsername = authProfile.displayName.toLowerCase().replace(/\s+/g, '');
    displayName = authProfile.displayName;
  }
  
  let username = baseUsername;
  let count = 1;
  
  // Make sure username is unique
  while (await this.findOne({ username })) {
    username = `${baseUsername}${count}`;
    count++;
  }
  
  // Create new user with minimal data
  user = new this({
    providerId: authProfile.id,
    provider: authProfile.provider,
    username: username,
    displayName: displayName,
    email: email
  });
  
  return user.save();
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
