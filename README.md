Since you are building this for a lab, the `README.md` should serve as both a setup guide and a "cheat sheet" for instructors. 

Here is the complete, professionally formatted `README.md` for your project.

---

=== FILE: README.md ===

# 🛡️ VulnShop v1.0: Educational Lab Environment

**WARNING: This application is INTENTIONALLY VULNERABLE. Do not host this on a public-facing server or use it for production purposes.**

VulnShop is a deliberately insecure e-commerce web application built for cybersecurity students. It provides a hands-on environment to practice the full "Kill Chain" of a web attack, from reconnaissance to data exfiltration.

## 🚀 Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Setup Script (Optional):**
   If you haven't manually created the folders:
   ```bash
   node setup.js
   ```

3. **Start the Server:**
   ```bash
   node server.js
   ```
   The application will be live at `http://localhost:3000`.

---

## 🛠️ Tech Stack
- **Backend:** Node.js (Express.js)
- **Database:** SQLite3 (In-memory)
- **Auth:** JSON Web Tokens (JWT)
- **Frontend:** Vanilla HTML5/JS (Fetch API)

---

## 🎯 Learning Objectives (Vulnerabilities)

| Category | Vulnerability | Location |
| :--- | :--- | :--- |
| **Authentication** | SQL Injection (Auth Bypass) | Login Page |
| **Injection** | UNION-based SQL Injection | Search Bar |
| **Broken Access** | IDOR (Insecure Direct Object Ref) | Order History |
| **Auth/Session** | JWT Secret Disclosure & Forgery | Admin Logs + `.env` |
| **XSS** | Stored & Reflected XSS | Reviews & Search |
| **Insecure File** | Local File Inclusion (LFI) | Admin Log Viewer |
| **Insecure File** | Unrestricted File Upload | Admin Dashboard |
| **Business Logic** | Client-side Price Manipulation | Checkout Process |

---

## 🕵️ Exploitation Walkthrough

### 1. The Entry Point (SQLi)
The login query uses string concatenation. 
- **Payload:** `' OR 1=1 --`
- **Result:** Log in as the first user (Admin) without a password.



### 2. Information Gathering (LFI)
The log viewer accepts a `file` parameter without sanitization.
- **Payload:** `?file=../../.env`
- **Result:** Discover the `JWT_SECRET`, allowing you to forge admin tokens at [jwt.io](https://jwt.io).

### 3. Database Dumping (SQLi UNION)
The product search can be forced to return data from the `users` table.
- **Payload:** `' UNION SELECT 1, email, password, role, 'img' FROM users --`
- **Result:** List all user credentials in the product grid.

### 4. Cross-Site Scripting (XSS)
Product reviews do not escape HTML characters.
- **Payload:** `<script>alert(localStorage.getItem('token'))</script>`
- **Result:** Steal the JWT of any user viewing that product.



### 5. Price Manipulation
The checkout API trusts the `total` field sent from the browser.
- **Action:** Open Developer Tools, change the value of the "Total" input to `0.01`, and click "Complete Purchase."
- **Result:** Purchase expensive items for pennies.

---

## 🧹 Resetting the Lab
Because the database is stored **in-memory**, simply restarting the server will reset all data, delete all created users, and clear the cart history.
```bash
# Press Ctrl+C to stop
node server.js
```

---

## 📝 Disclaimer
This software is for educational purposes only. Use it to learn how to identify and fix vulnerabilities, not for illegal activities. The author is not responsible for any misuse.
