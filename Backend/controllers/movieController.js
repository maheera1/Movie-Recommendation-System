// backend/controllers/movieController.js
const Movie = require('../models/Movie');

// Add a new movie (Admin only)
exports.addMovie = async (req, res) => {
    try {
        const newMovie = new Movie(req.body);
        await newMovie.save();
        res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
    } catch (error) {
        console.error("Error adding movie:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update movie (Admin only)
exports.updateMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const updatedMovie = await Movie.findByIdAndUpdate(movieId, req.body, { new: true });
        if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });
        res.json({ message: 'Movie updated successfully', movie: updatedMovie });
    } catch (error) {
        console.error("Error updating movie:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete movie (Admin only)
exports.deleteMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const deletedMovie = await Movie.findByIdAndDelete(movieId);
        if (!deletedMovie) return res.status(404).json({ message: 'Movie not found' });
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error("Error deleting movie:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get movie details (Public)
exports.getMovieDetails = async (req, res) => {
    try {
        const { movieId } = req.params;
        const movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (error) {
        console.error("Error fetching movie details:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all movies (Public)
exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Box Office Information
exports.updateBoxOffice = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { openingWeekend, totalEarnings, internationalRevenue } = req.body;

        const movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        // Update box office details
        movie.boxOffice = { openingWeekend, totalEarnings, internationalRevenue };
        await movie.save();

        res.json({ message: 'Box office details updated successfully', movie });
    } catch (error) {
        console.error("Error updating box office details:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add Awards to a Movie
exports.addAward = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { name, category, year, result } = req.body;

        const movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        // Add new award to the movie
        movie.awards.push({ name, category, year, result });
        await movie.save();

        res.json({ message: 'Award added successfully', movie });
    } catch (error) {
        console.error("Error adding award:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch Movie Awards
exports.getMovieAwards = async (req, res) => {
    try {
        const { movieId } = req.params;

        const movie = await Movie.findById(movieId).select('title awards');
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        res.json(movie);
    } catch (error) {
        console.error("Error fetching awards:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};