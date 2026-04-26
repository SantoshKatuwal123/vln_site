const API = {
    getHeaders: () => ({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
    }),
    
    login: async (email, password) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'products.html';
        } else {
            alert(data.error);
        }
    },

    logout: () => {
        localStorage.clear();
        window.location.href = 'login.html';
    }
};

// Check for nav links
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const nav = document.getElementById('nav');
    if (nav) {
        if (user) {
            nav.innerHTML = `
                <a href="products.html">Home</a>
                <a href="cart.html">Cart</a>
                <a href="orders.html">My Orders</a>
                ${user.role === 'admin' ? '<a href="admin.html">Admin</a>' : ''}
                <a href="#" onclick="API.logout()">Logout (${user.email})</a>
            `;
        } else {
            nav.innerHTML = '<a href="login.html">Login</a> <a href="register.html">Register</a>';
        }
    }
});
