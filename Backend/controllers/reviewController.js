// backend/controllers/reviewController.js
const Review = require('../models/Review');
const Movie = require('../models/Movie');

// Add or update a rating and review for a movie
exports.addOrUpdateReview = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { rating, reviewText } = req.body;

        // Find existing review by this user for the same movie
        let review = await Review.findOne({ movie: movieId, user: req.user.id });

        if (review) {
            // Update existing review
            review.rating = rating;
            review.reviewText = reviewText;
            await review.save();
            res.json({ message: 'Review updated successfully', review });
        } else {
            // Add new review
            review = new Review({ movie: movieId, user: req.user.id, rating, reviewText });
            await review.save();

            res.status(201).json({ message: 'Review added successfully', review });
        }
    } catch (error) {
        console.error("Error adding/updating review:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch all reviews for a movie
exports.getReviewsByMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const reviews = await Review.find({ movie: movieId })
            .populate('user', 'username')
            .sort({ likes: -1, rating: -1 }); // Sort by popularity and rating

        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get review highlights (top-rated and most-discussed reviews)
exports.getReviewHighlights = async (req, res) => {
    try {
        const { movieId } = req.params;
        const topRatedReviews = await Review.find({ movie: movieId })
            .sort({ likes: -1, ratings: -1 })
            .limit(5)
            .populate('user', 'username');
        
        res.json(topRatedReviews);
    } catch (error) {
        console.error("Error fetching review highlights:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Like a review
exports.likeReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        // Find the review and check if the user has already liked it
        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.likedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this review' });
        }

        // Add user to likedBy and increment likes
        review.likedBy.push(userId);
        review.likes += 1;
        await review.save();

        res.json({ message: 'Review liked successfully', likes: review.likes });
    } catch (error) {
        console.error("Error liking review:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Unlike a review
exports.unlikeReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        // Find the review and check if the user has already liked it
        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Check if the user has liked the review
        const likedIndex = review.likedBy.indexOf(userId);
        if (likedIndex === -1) {
            return res.status(400).json({ message: 'You have not liked this review yet' });
        }

        // Remove user from likedBy and decrement likes
        review.likedBy.splice(likedIndex, 1);
        review.likes -= 1;
        await review.save();

        res.json({ message: 'Review unliked successfully', likes: review.likes });
    } catch (error) {
        console.error("Error unliking review:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};