const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// Dynamic configuration endpoint for the frontend client
app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3006';
  res.send(`window.API_BASE = "${backendUrl}/computerstore";`);
});

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server is running on port ${port}`);
  console.log(`Configured backend URL: ${process.env.BACKEND_URL || 'http://localhost:3006'}`);
});
