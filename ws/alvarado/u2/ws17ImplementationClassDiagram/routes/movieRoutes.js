const express = require('express');
const Movie   = require('../models/movie');
const router  = express.Router();

// ── validation ─────────────────────────────────────────────────────────────

const validateMovieBody = (body) => {
    const errors = [];

    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
        errors.push('title is required.');
    }
    if (!body.director || typeof body.director !== 'string' || body.director.trim() === '') {
        errors.push('director is required.');
    }
    if (!body.genre || typeof body.genre !== 'string' || body.genre.trim() === '') {
        errors.push('genre is required.');
    }
    if (!Number.isInteger(body.releaseYear)) {
        errors.push('releaseYear must be a valid integer.');
    }
    if (typeof body.ticketPrice !== 'number' || body.ticketPrice <= 0) {
        errors.push('ticketPrice must be a number greater than zero.');
    }
    if (!Number.isInteger(body.ticketsSold) || body.ticketsSold < 0) {
        errors.push('ticketsSold must be an integer greater than or equal to zero.');
    }
    if (typeof body.productionCost !== 'number' || body.productionCost < 0) {
        errors.push('productionCost must be a number greater than or equal to zero.');
    }

    return errors;
};

// ── business rules ─────────────────────────────────────────────────────────

const calculateRevenue = (movie) =>
    parseFloat((movie.ticketPrice * movie.ticketsSold).toFixed(2));

const buildRanking = (movies) => {
    return movies
        .map((movie) => {
            const revenue = calculateRevenue(movie);
            const profit  = parseFloat((revenue - movie.productionCost).toFixed(2));
            return { title: movie.title, revenue, profit };
        })
        .sort((a, b) => b.profit - a.profit)
        .map((entry, index) => ({ ...entry, ranking: index + 1 }));
};

// ── endpoints ──────────────────────────────────────────────────────────────

// GET /api/movies/ranking  ← must be declared BEFORE /:id to avoid conflict
router.get('/ranking', async (req, res) => {
    try {
        const movies  = await Movie.findAll();
        const ranking = buildRanking(movies);
        res.status(200).json(ranking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.findAll();
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/movies
router.post('/', async (req, res) => {
    const errors = validateMovieBody(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/movies/:id/revenue
router.get('/:id/revenue', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found.' });
        }
        const revenue = calculateRevenue(movie);
        res.status(200).json({ movieId: movie.id, title: movie.title, revenue });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found.' });
        }
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
