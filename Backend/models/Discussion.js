const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who posted the comment
    content: { type: String, required: true }, // Comment content
    likes: { type: Number, default: 0 }, // Number of likes
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the comment
    replies: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who replied
            content: { type: String, required: true }, // Reply content
            createdAt: { type: Date, default: Date.now } // Reply timestamp
        }
    ]
}, { timestamps: true });

const discussionSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    associatedType: { type: String, enum: ['movie', 'genre', 'actor'], required: true },
    associatedId: { type: mongoose.Schema.Types.Mixed }, // Flexible for ObjectId or string
    comments: [commentSchema] // Embed comments directly
}, { timestamps: true });

module.exports = mongoose.model('Discussion', discussionSchema);
