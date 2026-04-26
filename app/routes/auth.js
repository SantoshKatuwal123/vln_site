const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { signToken } = require('../utils/jwtHelper');
const { logAction } = require('../utils/logger');

// VULNERABILITY: SQL Injection via string concatenation
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'";

    db.get(query, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message }); // Verbose error
        }
        if (user) {
            const token = signToken({ id: user.id, email: user.email, role: user.role });
            logAction(`Successful login for: ${user.email}`);
            res.json({ token, user: { email: user.email, role: user.role } });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

router.post('/register', (req, res) => {
    const { email, password } = req.body;
    db.run(`INSERT INTO users (email, password) VALUES ('${email}', '${password}')`, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        logAction(`New user registered: ${email}`);
        res.json({ message: "User created" });
    });
});

module.exports = router;
