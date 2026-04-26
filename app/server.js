const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure directories exist
['uploads', 'logs'].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Page Routing
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'pages/products.html')));
app.get('/:page.html', (req, res) => {
    const pagePath = path.join(__dirname, 'pages', `${req.params.page}.html`);
    if (fs.existsSync(pagePath)) {
        res.sendFile(pagePath);
    } else {
        res.status(404).send("Page not found");
    }
});

app.listen(PORT, () => {
    console.log(`[!] VulnShop running at http://localhost:${PORT}`);
    console.log(`[!] WARNING: This application is INTENTIONALLY INSECURE.`);
});
