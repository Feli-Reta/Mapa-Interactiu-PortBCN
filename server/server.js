const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Add CORS support if needed

const app = express();
const port = process.env.PORT || 80;

// Enable CORS (optional, remove if unnecessary)
app.use(cors());

// Serve static files correctly from the root
app.use(express.static(path.join(__dirname, '../')));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Route to fetch markers from markers.json
app.get('/api/markers', (req, res) => {
    const markersPath = path.join(__dirname, '../assets/markers.json');
    fs.readFile(markersPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading markers.json' });
        }
        res.json(JSON.parse(data));
    });
});

// Start the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
