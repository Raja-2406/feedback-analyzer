const jwt = require('jsonwebtoken');

// Verify JWT token
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // add user payload to request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Check for admin role
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin authorization required' });
    }
};

module.exports = { auth, admin };
