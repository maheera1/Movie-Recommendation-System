const mongoose = require('mongoose');

const newsArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Admin' }, // Author of the article
    tags: { type: [String], default: [] }, // Tags for categorization (e.g., "Movies", "Actors")
    createdAt: { type: Date, default: Date.now }, // Auto-timestamp
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('NewsArticle', newsArticleSchema);
