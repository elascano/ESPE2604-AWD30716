const express = require('express');
const router = express.Router();
const Pencil = require('../models/Pencil');

router.get('/:serial_number', async (req, res) => {
    try {
        const pencil = await Pencil.findOne({ serial_number: req.params.serial_number });
        if (!pencil) {
            return res.status(404).json({ message: 'Pencil not found' });
        }
        res.json(pencil);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
