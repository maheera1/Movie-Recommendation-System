// backend/routes/upcomingMovie.js
const express = require('express');
const router = express.Router();
const { addUpcomingMovie, getUpcomingMovies, setReminder,triggerNotifications } = require('../controllers/upcomingMovieController');
const auth = require('../middleware/authentication');
const admin = require('../middleware/admin');

// Admin routes
router.post('/', auth, admin, addUpcomingMovie);

// Public routes
router.get('/', auth, getUpcomingMovies);
router.post('/:movieId/reminder', auth, setReminder);

router.post('/triggernotifications', triggerNotifications);


module.exports = router;
