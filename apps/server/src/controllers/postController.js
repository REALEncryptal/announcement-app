const Post = require('../models/post');
const mongoose = require('mongoose');
const { isAuthenticated } = require('./authController');

/**
 * Post Controller
 * Handles all post-related operations
 */

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const newPost = new Post({
      title,
      content,
      tags: tags || [],
      userId: req.user._id
    });
    
    const savedPost = await newPost.save();
    
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating post' });
  }
};

// Get all posts with pagination and filtering
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, tag, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build query based on filters
    const query = {};
    
    if (userId) {
      query.userId = userId;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Validate pagination parameters
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }
    
    // Determine sort order
    const sortOrder = order.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;
    
    // Get total count for pagination metadata
    const totalCount = await Post.countDocuments(query);
    
    // Find posts with pagination
    const posts = await Post.find(query)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('userId', 'username profileImage')
      .exec();
    
    // Prepare pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    
    res.json({
      posts,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    const post = await Post.findById(postId)
      .populate('userId', 'username profileImage')
      .exec();
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Track view if user is authenticated and not the post creator
    if (req.isAuthenticated() && req.user._id.toString() !== post.userId._id.toString()) {
      // Check if user already viewed this post
      const alreadyViewed = post.viewers.some(viewerId => 
        viewerId.toString() === req.user._id.toString()
      );
      
      if (!alreadyViewed) {
        post.viewers.push(req.user._id);
        post.viewerCount += 1;
        await post.save();
      }
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Error fetching post' });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user is the owner of the post
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to edit this post' });
    }
    
    // Update post fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    
    const updatedPost = await post.save();
    
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Error updating post' });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user is the owner of the post
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }
    
    await Post.findByIdAndDelete(postId);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Error deleting post' });
  }
};

// Like/unlike a post
const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Get the User model to update user's likedPosts
    const User = mongoose.model('User');
    const user = await User.findById(userId);
    
    // Toggle like in user model
    const { action } = await user.toggleLike(postId);
    
    // Update post likes array based on action
    if (action === 'added') {
      // Like the post if not already liked
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
        post.likeCount += 1;
      }
    } else {
      // Unlike the post
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      post.likeCount = Math.max(0, post.likeCount - 1); // Ensure count doesn't go negative
    }
    
    const updatedPost = await post.save();
    
    res.json({
      post: updatedPost,
      action: action
    });
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    res.status(500).json({ error: 'Error liking/unliking post' });
  }
};

// Get posts by tag
const getPostsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Validate pagination parameters
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }
    
    // Get total count for pagination metadata
    const totalCount = await Post.countDocuments({ tags: tag });
    
    // Find posts with the specified tag
    const posts = await Post.find({ tags: tag })
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('userId', 'username profileImage')
      .exec();
    
    // Prepare pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    
    res.json({
      posts,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    res.status(500).json({ error: 'Error fetching posts by tag' });
  }
};

// Get user's liked posts
const getLikedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Validate pagination parameters
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }
    
    // Get total count for pagination metadata
    const totalCount = await Post.countDocuments({ likes: req.user._id });
    
    // Find posts liked by the user
    const posts = await Post.find({ likes: req.user._id })
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('userId', 'username profileImage')
      .exec();
    
    // Prepare pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    
    res.json({
      posts,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    res.status(500).json({ error: 'Error fetching liked posts' });
  }
};

// Export controller methods
module.exports = {
  // Auth middleware wrapper
  requireAuth: isAuthenticated,
  
  // CRUD operations
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  
  // Additional functionality
  likePost,
  getPostsByTag,
  getLikedPosts
};
