// backend/models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: [String], required: true },
    director: { type: String, required: true },
    cast: { type: [String], required: true },
    releaseDate: { type: Date, required: true },
    runtime: { type: Number, required: true }, // Runtime in minutes
    synopsis: { type: String, required: true },
    averageRating: { type: Number, default: 0 },
    trivia: { type: String, default: '' },
    goofs: { type: String, default: '' },
    soundtrack: { type: String, default: '' },
    ageRating: { type: String, required: true }, // e.g., PG-13, R
    parentalGuidance: { type: String, default: '' },
    boxOffice: {
        openingWeekend: { type: Number, default: 0 }, // Opening weekend earnings
        totalEarnings: { type: Number, default: 0 }, // Total earnings
        internationalRevenue: { type: Number, default: 0 } // International revenue
    },
    awards: [
        {
            name: { type: String, required: true }, // Award name (e.g., "Oscar")
            category: { type: String, required: true }, // Category (e.g., "Best Picture")
            year: { type: Number, required: true }, // Award year
            result: { type: String, enum: ['Won', 'Nominated'], required: true } // Result (e.g., "Won", "Nominated")
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
