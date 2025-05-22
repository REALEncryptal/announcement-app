const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
 * Post Schema
*/

const PostSchema = new Schema({
    // Title
    title: {
        type: String,
        required: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    // Main content
    content: {
        type: String,
        required: true,
        maxlength: [20000, 'Content cannot exceed 20,000 characters']
    },
    // Tags
    tags: [{
        type: String
    }],
    // User who created the post
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Likes
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Number of likes
    likeCount: {
        type: Number,
        default: 0
    },
    // Viewers
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Number of viewers
    viewerCount: {
        type: Number,
        default: 0
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add indexes for frequently queried fields
PostSchema.index({ userId: 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ createdAt: -1 }); // For timeline/feed sorting

// Pre-save hook to update the updatedAt field automatically
PostSchema.pre('save', function(next) {
    // Only update when document is modified (not on creation)
    if (this.isModified() && !this.isNew) {
        this.updatedAt = Date.now();
    }
    next();
});

// Export the model
module.exports = mongoose.model('Post', PostSchema);
