// backend/controllers/profileController.js
const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile with preferences
exports.updateProfile = async (req, res) => {
    try {
        const { preferences } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update preferences if provided
        if (preferences) user.preferences = preferences;
        await user.save();

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a movie to the wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { movieId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Add movieId to wishlist if not already present
        if (!user.wishlist.includes(movieId)) {
            user.wishlist.push(movieId);
            await user.save();
            res.json({ message: 'Movie added to wishlist', wishlist: user.wishlist });
        } else {
            res.status(400).json({ message: 'Movie is already in wishlist' });
        }
    } catch (error) {
        console.error("Error adding to wishlist:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove a movie from the wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { movieId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Remove movieId from wishlist if present
        user.wishlist = user.wishlist.filter(id => id !== movieId);
        await user.save();

        res.json({ message: 'Movie removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
        console.error("Error removing from wishlist:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
