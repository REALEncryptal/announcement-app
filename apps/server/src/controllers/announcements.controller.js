const asyncHandler = require('express-async-handler');
const CustomNotFoundError = require('../errors/CustomNotFoundError');
const Announcement = require('../models/announcement.model');

// Get all announcements
const getAllAnnouncements = asyncHandler(async (req, res) => {
    const announcements = await Announcement.find(); 

    res.status(200).json(announcements);
});

// Get announcement
const getAnnouncementById = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        throw new CustomNotFoundError('Announcement not found');
    }

    res.status(200).json(announcement);
});

// Create announcement
const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    
    // Validate required fields
    if (!title) {
        res.status(400);
        throw new Error('Title is required');
    }
    
    if (!content) {
        res.status(400);
        throw new Error('Content is required');
    }
    
    const announcement = await Announcement.create(req.body);
    res.status(201).json(announcement);
});

// Update announcement
const updateAnnouncement = asyncHandler(async (req, res) => {
    // Validate payload if title or content are being updated
    if (req.body.title === '') {
        res.status(400);
        throw new Error('Title cannot be empty');
    }
    
    if (req.body.content === '') {
        res.status(400);
        throw new Error('Content cannot be empty');
    }
    
    // Use runValidators to ensure Mongoose validates the update
    const announcement = await Announcement.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
    );

    if (!announcement) {
        throw new CustomNotFoundError('Announcement not found');
    }

    res.status(200).json(announcement);
});

// Delete announcement
const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
        throw new CustomNotFoundError('Announcement not found');
    }

    res.status(200).json({ message: 'Announcement deleted successfully' });
});

module.exports = {
    getAllAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
};
