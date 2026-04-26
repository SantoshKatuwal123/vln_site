const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const db = require('../models/database');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Unrestricted File Upload
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, file.originalname) // VULNERABILITY: Filename control
});
const upload = multer({ storage: storage });

router.post('/upload-product-image', upload.single('image'), (req, res) => {
    res.json({ message: "File uploaded", path: `/uploads/${req.file.originalname}` });
});

// VULNERABILITY: LFI (Local File Inclusion) via Path Traversal
router.get('/logs', (req, res) => {
    const fileName = req.query.file || 'system.log';
    const filePath = path.join(__dirname, '../logs/', fileName);

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        res.send(`<pre>${content}</pre>`);
    } catch (err) {
        res.status(500).send("Error reading log: " + err.message);
    }
});

router.get('/users', isAuthenticated, isAdmin, (req, res) => {
    db.all("SELECT id, email, role FROM users", (err, rows) => {
        res.json(rows);
    });
});

module.exports = router;
