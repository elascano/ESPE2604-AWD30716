const express = require('express');
// Corrección: Cambiamos 'customer' por 'Fruit'
const Fruit = require('../models/fruit'); 
const router = express.Router();

router.post('/fruit', async (req, res) => {
    try {
        // Corrección: Usamos 'Fruit' con mayúscula, tal como lo importamos
        const newFruit = new Fruit(req.body);
        const savedFruit = await newFruit.save();
        res.status(201).json(savedFruit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/fruits', async (req, res) => {
    try {
        // Corrección: Usamos 'Fruit' con mayúscula
        const fruits = await Fruit.find();
        res.json(fruits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;