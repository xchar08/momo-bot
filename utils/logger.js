// logger.js
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'bot.log');

const log = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error('Error writing to log file:', err);
    });
};

module.exports = { log };
