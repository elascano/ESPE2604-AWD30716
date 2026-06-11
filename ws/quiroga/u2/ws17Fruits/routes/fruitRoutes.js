const express = require('express');
const router = express.Router();

const FruitController = require('../controllers/fruit.controller.js');

router.post(
    '/fruit',
    FruitController.createFruit
);

router.get(
    '/fruits',
    FruitController.getAllFruits
);

router.get(
    '/fruit/:category',
    FruitController.getFruitsByCategory
);

router.put(
    '/fruit/:id/calculate-earnings',
    FruitController.calculateEarnings
);

router.get('/total-earnings', FruitController.getTotalEarnings);

module.exports = router;