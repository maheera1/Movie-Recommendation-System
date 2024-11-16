const express = require('express');
const router = express.Router();
const {
    createDiscussion,
    getAllDiscussions,
    addComment,
    getComments,
    likeComment,
    replyToComment
} = require('../controllers/discussionController');
const auth = require('../middleware/authentication');

// Routes
router.post('/', auth, createDiscussion); // Create a new discussion
router.get('/', getAllDiscussions); // Fetch all discussions
router.post('/:discussionId/comments', auth, addComment); // Add a comment
router.get('/:discussionId/comments', getComments); // Fetch comments for a discussion
router.post('/:discussionId/comments/:commentId/like', auth, likeComment); // Like a comment
router.post('/:discussionId/comments/:commentId/reply', auth, replyToComment); // Reply to a comment

module.exports = router;
