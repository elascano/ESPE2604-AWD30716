const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());

app.get('/api/mice', async (req, res) => {
    try {
        const mice = await prisma.mouse.findMany();
        res.status(200).json(mice);
    } catch (error) {
        res.status(500).json({ error: 'Database error: Failed to fetch mice records' });
    }
});

app.post('/api/mice', async (req, res) => {
    try {
        const newMouse = await prisma.mouse.create({ data: req.body });
        res.status(201).json(newMouse);
    } catch (error) {
        res.status(500).json({ error: 'Database error: Failed to create mouse record' });
    }
});

app.listen(PORT, () => {
    console.log(`Data API Service running on port ${PORT}`);
});