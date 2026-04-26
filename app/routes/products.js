const express = require('express');
const router = express.Router();
const db = require('../models/database');

// VULNERABILITY: SQL Injection in search & Reflected XSS
router.get('/search', (req, res) => {
    const keyword = req.query.q || '';
    const query = "SELECT * FROM products WHERE name LIKE '%" + keyword + "%'";

    db.all(query, (err, rows) => {
        if (err) return res.status(500).send(err.message);
        // VULNERABILITY: Reflected XSS (returning raw keyword)
        res.json({ results: rows, keyword: keyword });
    });
});

router.get('/:id', (req, res) => {
    db.get(`SELECT * FROM products WHERE id = ${req.params.id}`, (err, row) => {
        res.json(row);
    });
});

router.get('/:id/reviews', (req, res) => {
    db.all(`SELECT * FROM reviews WHERE product_id = ${req.params.id}`, (err, rows) => {
        res.json(rows);
    });
});

// VULNERABILITY: Stored XSS
router.post('/:id/reviews', (req, res) => {
    const { email, comment } = req.body;
    db.run(`INSERT INTO reviews (product_id, user_email, comment) VALUES (${req.params.id}, '${email}', '${comment}')`, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Review added" });
    });
});

module.exports = router;
