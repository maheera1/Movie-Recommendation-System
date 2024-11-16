const express = require('express');
const router = express.Router();
const {
    getAllArticles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle
} = require('../controllers/newsArticleController');
const auth = require('../middleware/authentication');
const admin = require('../middleware/admin');

// Public routes
router.get('/', getAllArticles); // Get all articles
router.get('/:articleId', getArticleById); // Get a specific article by ID

// Admin routes
router.post('/', auth, admin, addArticle); // Add a new article
router.put('/:articleId', auth, admin, updateArticle); // Update an article
router.delete('/:articleId', auth, admin, deleteArticle); // Delete an article

module.exports = router;
