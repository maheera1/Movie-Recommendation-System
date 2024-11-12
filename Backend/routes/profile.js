// backend/routes/profile.js
const express = require('express');
const { getProfile, updateProfile, addToWishlist, removeFromWishlist } = require('../controllers/profileController');
const auth = require('../middleware/authentication'); // Middleware to protect routes
const router = express.Router();

// Get user profile
router.get('/', auth, getProfile);

// Update user profile
router.put('/', auth, updateProfile);

// Add movie to wishlist
router.post('/wishlist', auth, addToWishlist);

// Remove movie from wishlist
router.delete('/wishlist', auth, removeFromWishlist);

module.exports = router;
