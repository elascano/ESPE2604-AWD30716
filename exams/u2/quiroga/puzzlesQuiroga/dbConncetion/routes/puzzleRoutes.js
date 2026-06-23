const express = require('express');
const router = express.Router();

const PuzzleController = require('../controllers/Puzzle.controller.js');

router.post(
    '/puzzle',
    PuzzleController.postPuzzle
);

router.get(
    '/health',
    PuzzleController.healthCheck
);

module.exports = router;