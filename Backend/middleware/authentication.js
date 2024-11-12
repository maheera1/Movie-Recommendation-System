// backend/middleware/authentication.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if token is present
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Set the user in the request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
