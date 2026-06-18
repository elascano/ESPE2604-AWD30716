const express = require('express');
const router = express.Router();

const PuzzleController = require('../controllers/puzzle.controller.js');

router.post(
    '/puzzle',
    PuzzleController.postPuzzle
);


module.exports = router;