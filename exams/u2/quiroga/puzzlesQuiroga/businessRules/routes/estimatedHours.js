const express = require('express');
const router = express.Router();

const computer = require('../services/puzzle.service.js');

router.get(
    '/estimatedHours',
    computer.computeEstimatedHours
);


module.exports = router;