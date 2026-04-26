const jwt = require('jsonwebtoken');

// HARDCODED SECRET - Vulnerability: Secret recovery
const SECRET = process.env.JWT_SECRET || 'supersecretkey123';

const signToken = (payload) => {
    return jwt.sign(payload, SECRET); // No expiration
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = { signToken, verifyToken };
