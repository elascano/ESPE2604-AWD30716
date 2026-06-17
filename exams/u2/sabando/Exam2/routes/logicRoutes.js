const express = require("express");
const table = require("../models/table");
const router = express.Router();

// Get statistics: calculate total tables by material (wood, plastic, steel)
router.get("/tables/stats", async (req, res) => {
    try {
        console.log("[LOGIC] Calculating material stats");
        const tables = await table.getAll();
        const stats = tables.reduce((acc, t) => {
            const material = t.material ? t.material.toLowerCase() : "unknown";
            acc[material] = (acc[material] || 0) + 1;
            return acc;
        }, { wood: 0, plastic: 0, steel: 0 });
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get tables by shape and count them (e.g. /table/circular) - Business Rule
router.get("/table/:shape", async (req, res) => {
    const { shape } = req.params;
    try {
        console.log(`[LOGIC] Filtering and counting tables by shape: ${shape}`);
        const tables = await table.getTablesByShape(shape);
        res.json({
            shape: shape.toLowerCase(),
            count: tables.length,
            tables
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
