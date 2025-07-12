require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// API endpoint to get NASA API key
app.get('/api/nasa-key', (req, res) => {
  // Debug print
  console.log('API KEY FROM ENV:', process.env.NASA_API_KEY);
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NASA API key not configured' });
  }
  res.json({ apiKey });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('NASA API key loaded from environment variables');
}); 