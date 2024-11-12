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