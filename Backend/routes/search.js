// backend/routes/search.js
const express = require('express');
const {
    searchMovies,
    getTopMoviesByGenre,
    getTopMoviesOfMonth
} = require('../controllers/searchController');

const router = express.Router();

// Search and filter movies
router.get('/movies', searchMovies);

// Get top movies by genre
router.get('/movies/top/:genre', getTopMoviesByGenre);

// Get top movies of a specified month (optional month and year)
router.get('/movies/top/month/:month/:year', getTopMoviesOfMonth);

module.exports = router;
