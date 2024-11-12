// backend/models/CustomList.js
const mongoose = require('mongoose');

const customListSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Users who saved/followed this list
}, { timestamps: true });

module.exports = mongoose.model('CustomList', customListSchema);
