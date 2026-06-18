const express = require('express');
const cors = require('cors');
const { calculateRangeCategory, calculateRecommendation } = require('./utils/businessRules');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4005;

const DATA_API_URL = process.env.DATA_API_URL || 'http://localhost:4004/api/mice';

app.use(cors());
app.use(express.json());

app.post('/api/logic/mice', async (req, res) => {
    try {
        const { serialNumber, brand, model, dpi, releaseDate, isNew, price } = req.body;

        const rangeCategory = calculateRangeCategory(price);
        const recommendation = calculateRecommendation(releaseDate);

        const enrichedPayload = {
            serialNumber,
            brand,
            model,
            dpi,
            releaseDate: new Date(releaseDate),
            isNew,
            price,
            rangeCategory,
            recommendation
        };

        const response = await fetch(DATA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enrichedPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error || 'Failed to communicate with Data API' });
        }

        res.status(201).json({
            message: 'Mouse successfully processed and stored',
            data: data
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error in Logic API' });
    }
});

app.listen(PORT, () => {
    console.log(`Business Logic API Service running on port ${PORT}`);
});