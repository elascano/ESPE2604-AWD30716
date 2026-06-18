const express = require('express');
const Tv      = require('../models/tv');
const router  = express.Router();

const validateTvBody = (body) => {
    const errors = [];
    if (!body.brand  || typeof body.brand  !== 'string' || body.brand.trim()  === '') errors.push('brand is required.');
    if (!body.model  || typeof body.model  !== 'string' || body.model.trim()  === '') errors.push('model is required.');
    if (!body.status || typeof body.status !== 'string' || body.status.trim() === '') errors.push('status is required.');
    if (body.stock === undefined || !Number.isInteger(body.stock) || body.stock < 0)   errors.push('stock must be a non-negative integer.');
    if (body.size  === undefined || typeof body.size  !== 'number' || body.size  <= 0) errors.push('size must be a number greater than zero.');
    if (body.price === undefined || typeof body.price !== 'number' || body.price <  0) errors.push('price must be a non-negative number.');
    return errors;
};

router.post('/', async (req, res) => {
    const errors = validateTvBody(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });
    try {
        const tv = await Tv.create(req.body);
        return res.status(201).json(tv);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
