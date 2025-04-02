// announcements.routes.js

const express = require('express');
const { 
    getAllAnnouncements, 
    getAnnouncementById, 
    createAnnouncement, 
    updateAnnouncement, 
    deleteAnnouncement 
} = require('../controllers/announcements.controller');

const router = express.Router();

// Routes
router.get('/', getAllAnnouncements);
router.get('/:id', getAnnouncementById);
router.post('/', createAnnouncement);
router.put('/:id', updateAnnouncement);
router.delete('/:id', deleteAnnouncement);

module.exports = router;
