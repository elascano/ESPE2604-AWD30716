// routes/cellphoneRoutes.js
const express = require('express');
const router = express.Router();
const prisma = require('../models/prismaClient');
const { calculateRangeCategory, calculateRecommendation } = require('../utils/calculations');

// URI: GET /api/cellphones
router.get('/', async (req, res) => {
    try {
        const cellphones = await prisma.cellphone.findMany();
        res.status(200).json(cellphones);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cellphones' });
    }
});

// URI: POST /api/cellphones
router.post('/', async (req, res) => {
    try {
        const { name, description, price, releaseDate, model, originCountry, manufacturer } = req.body;
        const parsedDate = new Date(releaseDate);

        const newCellphone = await prisma.cellphone.create({
            data: {
                name,
                description,
                price,
                releaseDate: parsedDate,
                model,
                originCountry,
                manufacturer,
                rangeCategory: calculateRangeCategory(price),
                recommendation: calculateRecommendation(parsedDate),
            },
        });

        res.status(201).json(newCellphone);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create cellphone' });
    }
});

// URI: PUT /api/cellphones/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        
        const existingRecord = await prisma.cellphone.findUnique({ where: { id } });

        if (!existingRecord) {
            return res.status(404).json({ error: 'Cellphone not found' });
        }

        const updatedPrice = body.price !== undefined ? body.price : existingRecord.price;
        const updatedDate = body.releaseDate ? new Date(body.releaseDate) : existingRecord.releaseDate;

        const updatedCellphone = await prisma.cellphone.update({
            where: { id },
            data: {
                ...body,
                releaseDate: body.releaseDate ? new Date(body.releaseDate) : undefined,
                rangeCategory: calculateRangeCategory(updatedPrice),
                recommendation: calculateRecommendation(updatedDate),
            },
        });

        res.status(200).json(updatedCellphone);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update cellphone' });
    }
});

// URI: DELETE /api/cellphones/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.cellphone.delete({ where: { id } });
        res.status(200).json({ message: 'Cellphone deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete cellphone' });
    }
});

module.exports = router;