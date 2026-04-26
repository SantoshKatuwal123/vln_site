const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { isAuthenticated } = require('../middleware/authMiddleware');

// VULNERABILITY: IDOR (No check if user_id matches logged in user)
router.get('/:id', (req, res) => {
    const query = `SELECT * FROM orders WHERE id = ${req.params.id}`;
    db.get(query, (err, row) => {
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    });
});

router.get('/user/:userId', (req, res) => {
    const query = `SELECT * FROM orders WHERE user_id = ${req.params.userId}`;
    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
