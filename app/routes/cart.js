const express = require('express');
const router = express.Router();

// Logic held in memory/session-like for simplicity
router.post('/checkout', (req, res) => {
    const { items, coupon, total } = req.body;

    // VULNERABILITY: Business Logic Flaw
    // Trusting the total price sent from the client
    // No server-side verification of item prices or quantity
    
    if (total < 0) {
        return res.status(400).json({ error: "Are you trying to rob us?" });
    }

    res.json({ 
        message: "Order placed successfully!", 
        charged: total,
        orderId: "ORD-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 1000)
    });
});

module.exports = router;
