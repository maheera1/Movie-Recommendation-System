// backend/routes/movie.js
const express = require('express');
const { addMovie, updateMovie, deleteMovie, getMovieDetails, getAllMovies, updateBoxOffice, addAward, getMovieAwards } = require('../controllers/movieController');
const auth = require('../middleware/authentication'); // JWT authentication middleware
const admin = require('../middleware/admin'); // Admin role check middleware
const router = express.Router();

// Public route to get all movies
router.get('/', getAllMovies);

// Public route to get movie details
router.get('/:movieId', getMovieDetails);
router.get('/:movieId/awards', getMovieAwards);

// Admin-only routes to add, update, and delete movies
router.post('/', auth, admin, addMovie);
router.put('/:movieId', auth, admin, updateMovie);
router.delete('/:movieId', auth, admin, deleteMovie);
router.put('/:movieId/box-office', auth, admin, updateBoxOffice); // Update box office details
router.post('/:movieId/awards', auth, admin, addAward); // Add award to a movie

module.exports = router;
