const pool = require('../config/db');

// ── helpers ────────────────────────────────────────────────────────────────

/**
 * Maps a raw database row (snake_case) to the Movie entity (camelCase).
 */
const toMovie = (row) => ({
    id:             row.id,
    title:          row.title,
    director:       row.director,
    genre:          row.genre,
    releaseYear:    row.release_year,
    ticketPrice:    parseFloat(row.ticket_price),
    ticketsSold:    row.tickets_sold,
    productionCost: parseFloat(row.production_cost),
    createdAt:      row.created_at
});

// ── queries ────────────────────────────────────────────────────────────────

const findAll = async () => {
    const result = await pool.query(
        'SELECT * FROM movies ORDER BY id ASC'
    );
    return result.rows.map(toMovie);
};

const findById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM movies WHERE id = $1',
        [id]
    );
    return result.rows.length ? toMovie(result.rows[0]) : null;
};

const create = async ({ title, director, genre, releaseYear, ticketPrice, ticketsSold, productionCost }) => {
    const result = await pool.query(
        `INSERT INTO movies (title, director, genre, release_year, ticket_price, tickets_sold, production_cost)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [title, director, genre, releaseYear, ticketPrice, ticketsSold, productionCost]
    );
    return toMovie(result.rows[0]);
};

module.exports = { findAll, findById, create };
