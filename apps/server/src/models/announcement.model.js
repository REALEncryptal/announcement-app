const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    tags: [
        {
            type: {
                type: String,
                required: [true, 'Tag type is required']
            },
            color: {
                type: String,
                required: [true, 'Tag color is required']
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})



AnnouncementSchema.pre('save', async function (next) {
    this.createdAt = Date.now();
    next();    
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);


