// backend/middleware/authentication.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // This should set the user ID in req.user

        // Fetch the full user record to include the role
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({ message: 'User not found' });
        
        req.user.role = user.role; // Set the role in req.user for admin check
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
