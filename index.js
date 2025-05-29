const express = require('express');
const axios = require('axios');
const app = express();
const port = 5555;

// Environment variables for security
const GAS_ID = process.env.GAS_ID || 'AKfycbzV-u6SS_PuZXKClcrTDTHJboJrjnY84djrj6XwHEqk0W8hQSqDUaBGzDVNHs5r5iuy';
const GAS_URL = `https://script.google.com/macros/s/${GAS_ID}/exec`;

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/log', async (req, res) => {
    const { temp, hum } = req.query;

    if (!temp || !hum) {
        console.error('Missing parameters');
        return res.status(400).json({ error: 'Missing temp or hum' });
    }

    try {
        console.log(`Forwarding data to GAS - Temp: ${temp}, Hum: ${hum}`);
        const gasResponse = await axios.get(`${GAS_URL}?temp=${temp}&hum=${hum}`, {
            timeout: 5000
        });

        console.log('GAS Response:', gasResponse.data);
        res.send(`Forwarded to GAS: ${gasResponse.data}`);
    } catch (err) {
        console.error('GAS Error:', err.message);

        if (err.response) {
            // Forward the Google Sheets error
            res.status(502).send(`GAS Error: ${err.response.data}`);
        } else {
            res.status(504).send('Timeout connecting to Google Sheets');
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
    console.log(`Google Sheets endpoint: ${GAS_URL}`);
});
