const fs = require('fs');
const path = require('path');

const logAction = (message) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(path.join(__dirname, '../logs/system.log'), logEntry);
};

module.exports = { logAction };
