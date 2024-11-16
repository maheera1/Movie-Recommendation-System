const express = require('express');
const { getStatistics, getSearchInsights, getAdminInsights } = require('../controllers/adminController');
const auth = require('../middleware/authentication');
const admin = require('../middleware/admin');
const router = express.Router();

// Route for fetching site statistics
router.get('/statistics', auth, admin, getStatistics);

// Route for fetching search insights
router.get('/search-insights', auth, admin, getSearchInsights);

// Route for fetching admin insights
router.get('/admin-insights', auth, admin, getAdminInsights);

module.exports = router;
