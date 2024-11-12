// backend/controllers/searchController.js
const Movie = require('../models/Movie');

// Search and filter movies based on query parameters
exports.searchMovies = async (req, res) => {
    try {
        const {
            title,
            genre,
            director,
            actor,
            minRating,
            maxRating,
            popularity,
            releaseYear,
            releaseDecade,
            country,
            language,
            keyword,
            topGenre,
            topMonth
        } = req.query;

        const query = {};

        // Basic search criteria
        if (title) query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        if (genre) query.genre = { $in: genre.split(',') };
        if (director) query.director = { $regex: director, $options: 'i' };
        if (actor) query.cast = { $regex: actor, $options: 'i' };

        // Filter criteria
        if (minRating || maxRating) {
            query.averageRating = {};
            if (minRating) query.averageRating.$gte = parseFloat(minRating);
            if (maxRating) query.averageRating.$lte = parseFloat(maxRating);
        }

        if (popularity) query.popularity = { $gte: parseInt(popularity) }; // Assume popularity is a metric like views or reviews count
        if (releaseYear) query.releaseDate = { $year: releaseYear };
        if (releaseDecade) {
            const startYear = Math.floor(parseInt(releaseDecade) / 10) * 10;
            query.releaseDate = { $gte: new Date(startYear, 0, 1), $lt: new Date(startYear + 10, 0, 1) };
        }

        if (country) query.country = { $regex: country, $options: 'i' };
        if (language) query.language = { $regex: language, $options: 'i' };
        if (keyword) query.synopsis = { $regex: keyword, $options: 'i' };

        // Execute search and filtering
        const movies = await Movie.find(query).sort({ averageRating: -1 }).limit(20);
        res.json(movies);
    } catch (error) {
        console.error("Error searching movies:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get top movies by genre
exports.getTopMoviesByGenre = async (req, res) => {
    try {
        const { genre } = req.params;
        const movies = await Movie.find({ genre: genre })
            .sort({ averageRating: -1 })
            .limit(10);
        res.json(movies);
    } catch (error) {
        console.error("Error fetching top movies by genre:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get top movies of a specified month and year, defaulting to the current month and year if not provided
exports.getTopMoviesOfMonth = async (req, res) => {
    try {
        // Read month and year from path parameters
        const month = parseInt(req.params.month) - 1; // 0-indexed month
        const year = parseInt(req.params.year);

        // Construct startDate and endDate
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 1);

        const movies = await Movie.find({
            releaseDate: {
                $gte: startDate,
                $lt: endDate
            }
        }).sort({ averageRating: -1 }).limit(10);

        res.json(movies);
    } catch (error) {
        console.error("Error in getTopMoviesOfMonth function:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

