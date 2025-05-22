const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const postController = require('../controllers/postController');

// Apply auth middleware only to endpoints that modify data
const { requireAuth } = postController;

// Get all posts (public route)
router.get('/', postController.getPosts);

// Get posts by tag (public route)
router.get('/tag/:tag', postController.getPostsByTag);

// Get posts by user ID (public route) - works for any user
// This same endpoint can be used for "my posts" by passing the current user's ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }
    
    // Get total count 
    const totalCount = await Post.countDocuments({ userId });
    
    // Find posts authored by the specified user
    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('userId', 'username avatar')
      .exec();
    
    res.json({
      posts,
      total: totalCount,
      page: pageNum,
      limit: limitNum
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Error fetching user posts' });
  }
});



// Get liked posts - keep auth since this is user-specific
router.get('/liked', requireAuth, postController.getLikedPosts);

// Get post by ID (public route) - must be AFTER other specific routes
router.get('/:id', postController.getPostById);

// Create a new post - requires auth to know who created it
router.post('/', requireAuth, postController.createPost);

// Update a post - requires auth to verify ownership
router.patch('/:id', requireAuth, postController.updatePost);

// Delete a post - requires auth to verify ownership
router.delete('/:id', requireAuth, postController.deletePost);

// Like/unlike a post - requires auth to know who is liking
router.post('/:id/like', requireAuth, postController.likePost);

module.exports = router;
