// backend/routes/review.js
const express = require('express');
const { addOrUpdateReview, getReviewsByMovie, getReviewHighlights, likeReview, unlikeReview } = require('../controllers/reviewController');
const auth = require('../middleware/authentication');
const router = express.Router();

// Route to like a review (requires authentication)
router.post('/:reviewId/like', auth, likeReview);

// Route to unlike a review (requires authentication)
router.post('/:reviewId/unlike', auth, unlikeReview);

// Add or update a review (requires authentication)
router.post('/:movieId', auth, addOrUpdateReview);

// Get all reviews for a movie (public)
router.get('/:movieId', getReviewsByMovie);

// Get review highlights for a movie (public)
router.get('/:movieId/highlights', getReviewHighlights);

module.exports = router;
