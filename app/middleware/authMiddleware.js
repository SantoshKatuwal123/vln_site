const { verifyToken } = require('../utils/jwtHelper');

const isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: "Invalid token" });

    req.user = decoded;
    next();
};

const isAdmin = (req, res, next) => {
    // VULNERABILITY: Relies solely on JWT role claim which can be forged if secret is known
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: "Admin access required" });
    }
};

module.exports = { isAuthenticated, isAdmin };
