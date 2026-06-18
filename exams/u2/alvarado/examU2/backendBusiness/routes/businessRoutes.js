const express  = require('express');
const router   = express.Router();
const CRUD_URL = process.env.CRUD_BACKEND_URL; 

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

router.post('/warehouseSpace', async (req, res) => {
    const errors = validateTvBody(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const { brand, model, status, stock, size, price } = req.body;

    const warehouseSpace = parseFloat((stock * size).toFixed(2));

    if (warehouseSpace > 100) {
        return res.status(409).json({
            message:        'TV cannot be stored: exceeds warehouse space limit.',
            warehouseSpace: warehouseSpace,
            limit:          100
        });
    }

    try {
        const response = await fetch(`${CRUD_URL}/happytv/tv`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ brand, model, status, stock, size, price })
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(502).json({
                message: 'CRUD backend error.',
                detail:  error
            });
        }

        const tv = await response.json();
        return res.status(201).json({
            ...tv,
            warehouseSpace: warehouseSpace,
            message:        'TV stored successfully.'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
