// backend/controllers/recommendationController.js
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const User = require('../models/User');

// Personalized recommendations for the user based on favorite genres and ratings
exports.getUserRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const favoriteGenres = user.preferences || [];

        // Find movies in user's favorite genres, sorted by popularity or rating
        const recommendedMovies = await Movie.find({ genre: { $in: favoriteGenres } })
            .sort({ averageRating: -1 })
            .limit(10);

        res.json(recommendedMovies);
    } catch (error) {
        console.error("Error fetching user recommendations:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Similar titles based on genre and director
exports.getSimilarTitles = async (req, res) => {
    try {
        const { movieId } = req.params;
        const movie = await Movie.findById(movieId);

        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        const similarMovies = await Movie.find({
            _id: { $ne: movieId }, // Exclude the current movie
            $or: [
                { genre: { $in: movie.genre } },
                { director: movie.director }
            ]
        }).sort({ averageRating: -1 }).limit(10);

        res.json(similarMovies);
    } catch (error) {
        console.error("Error fetching similar titles:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Trending movies for the current user based on preferences and recent activity
exports.getTrendingMovies = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const favoriteGenres = user.preferences || [];

        // Find trending movies in the user's preferred genres
        const trendingMovies = await Review.aggregate([
            { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }, // Last 7 days
            { $group: { _id: "$movie", averageRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } },
            { $sort: { reviewCount: -1, averageRating: -1 } },
            { $limit: 10 }
        ]).lookup({
            from: "movies",
            localField: "_id",
            foreignField: "_id",
            as: "movieInfo"
        }).unwind("movieInfo").match({ "movieInfo.genre": { $in: favoriteGenres } });

        res.json(trendingMovies.map(item => item.movieInfo));
    } catch (error) {
        console.error("Error fetching trending movies:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Top-rated movies personalized for the current user
exports.getTopRatedMovies = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const favoriteGenres = user.preferences || [];

        // Find top-rated movies in the user's preferred genres
        const topRatedMovies = await Movie.find({ genre: { $in: favoriteGenres } })
            .sort({ averageRating: -1 })
            .limit(10);

        res.json(topRatedMovies);
    } catch (error) {
        console.error("Error fetching top-rated movies:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
