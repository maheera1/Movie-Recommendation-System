const Movie = require('../models/Movie');
const User = require('../models/User');
const Review = require('../models/Review');

// Fetch site statistics
exports.getStatistics = async (req, res) => {
    try {
        const mostPopularMovies = await Movie.find().sort({ averageRating: -1 }).limit(10);
        const userCount = await User.countDocuments();
        const reviewCount = await Review.countDocuments();

        res.json({
            statistics: {
                userCount,
                reviewCount,
                mostPopularMovies
            }
        });
    } catch (error) {
        console.error("Error fetching site statistics:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch search insights (e.g., most searched actors, genres)
exports.getSearchInsights = async (req, res) => {
    try {
        // Example: Aggregate search logs from a hypothetical SearchLog collection
        const searchInsights = await Movie.aggregate([
            { $unwind: '$genre' },
            { $group: { _id: '$genre', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 } // Most searched genres
        ]);

        res.json({ searchInsights });
    } catch (error) {
        console.error("Error fetching search insights:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch admin insights (e.g., trending genres, user engagement)
exports.getAdminInsights = async (req, res) => {
    try {
        const trendingGenres = await Movie.aggregate([
            { $unwind: '$genre' },
            { $group: { _id: '$genre', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const mostEngagedUsers = await User.aggregate([
            {
                $project: {
                    username: 1,
                    email: 1,
                    reviewsCount: { $size: { $ifNull: ['$reviews', []] } },
                    wishlistCount: { $size: { $ifNull: ['$wishlist', []] } }
                }
            },
            { $sort: { reviewsCount: -1, wishlistCount: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            insights: {
                trendingGenres,
                mostEngagedUsers
            }
        });
    } catch (error) {
        console.error("Error fetching admin insights:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
