const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // In-memory for easy lab resets

db.serialize(() => {
    // Users Table (Plaintext passwords!)
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        password TEXT,
        role TEXT DEFAULT 'customer'
    )`);

    // Products Table
    db.run(`CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price REAL,
        image_url TEXT
    )`);

    // Reviews Table (Target for XSS)
    db.run(`CREATE TABLE reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        user_email TEXT,
        comment TEXT
    )`);

    // Orders Table (Target for IDOR)
    db.run(`CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_no TEXT,
        user_id INTEGER,
        total REAL,
        status TEXT
    )`);

    // Seed Data
    db.run("INSERT INTO users (email, password, role) VALUES ('admin@vulnshop.com', 'admin1234', 'admin')");
    db.run("INSERT INTO users (email, password, role) VALUES ('user@example.com', 'password', 'customer')");
    
    db.run("INSERT INTO products (name, description, price, image_url) VALUES ('Premium Laptop', 'High performance laptop for pros', 1200.00, '/uploads/laptop.jpg')");
    db.run("INSERT INTO products (name, description, price, image_url) VALUES ('Mechanical Keyboard', 'Clicky and tactile typing', 150.00, '/uploads/kb.jpg')");
    db.run("INSERT INTO products (name, description, price, image_url) VALUES ('Ultrawide Monitor', '49 inch gaming display', 900.00, '/uploads/monitor.jpg')");

    db.run("INSERT INTO orders (order_no, user_id, total, status) VALUES ('ORD-2026-001', 1, 1200.00, 'Shipped')");
    db.run("INSERT INTO orders (order_no, user_id, total, status) VALUES ('ORD-2026-002', 2, 150.00, 'Processing')");
});

module.exports = db;
