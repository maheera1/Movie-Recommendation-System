// backend/routes/recommendation.js
const express = require('express');
const {
    getUserRecommendations,
    getSimilarTitles,
    getTrendingMovies,
    getTopRatedMovies
} = require('../controllers/recommendationController');
const auth = require('../middleware/authentication');
const router = express.Router();

// Personalized recommendations for the logged-in user
router.get('/personalized', auth, getUserRecommendations);

// Similar titles based on a movie's genre and director (public access)
router.get('/similar/:movieId', getSimilarTitles);

// Trending movies personalized for the logged-in user
router.get('/trending', auth, getTrendingMovies);

// Top-rated movies personalized for the logged-in user
router.get('/top-rated', auth, getTopRatedMovies);

module.exports = router;
