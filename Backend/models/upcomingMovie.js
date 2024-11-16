// backend/models/upcomingMovie.js
const mongoose = require('mongoose');

const upcomingMovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: [String], required: true },
    director: { type: String },
    cast: { type: [String] },
    releaseDate: { type: Date, required: true },
    trailerLink: { type: String },
    notifications: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        email: { type: String },
        notified: { type: Boolean, default: false } // Track if the user has been notified
    }]
}, { timestamps: true });

module.exports = mongoose.model('upcomingMovie', upcomingMovieSchema);
