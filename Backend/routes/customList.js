// backend/routes/customList.js
const express = require('express');
const {
    createCustomList,
    getAllLists,
    followList,
    unfollowList,
    getUserLists
} = require('../controllers/customListController');
const auth = require('../middleware/authentication'); // Require authentication for certain actions
const router = express.Router();

// Create a custom list (requires authentication)
router.post('/', auth, createCustomList);

// Get all custom lists (public)
router.get('/', getAllLists);

// Follow/Save a custom list (requires authentication)
router.post('/:listId/follow', auth, followList);

// Unfollow/Unsave a custom list (requires authentication)
router.post('/:listId/unfollow', auth, unfollowList);

// Get lists created by a specific user (public)
router.get('/user/:userId', getUserLists);

module.exports = router;
