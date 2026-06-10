require('dotenv').config();

const express = require('express');
const pool    = require('./config/db');

const app  = express();
const port = process.env.PORT || 3000;

// ── middleware ─────────────────────────────────────────────────────────────
app.use(express.json());

// ── verify DB connection on startup ───────────────────────────────────────
pool.query('SELECT NOW()', (err) => {
    if (err) {
        console.error('Failed to connect to database:', err.message);
        process.exit(1);
    }
    console.log('System connected to Supabase PostgreSQL Database');
});

// ── routes ─────────────────────────────────────────────────────────────────
const movieRouter = require('./routes/movieRoutes');
app.use('/api/movies', movieRouter);

// ── start server ───────────────────────────────────────────────────────────
app.listen(port, () => {
    console.log(`Movies API Server is running on port --> ${port}`);
});
