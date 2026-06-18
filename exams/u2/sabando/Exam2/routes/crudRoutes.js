const express = require("express");
const table = require("../models/table");
const router = express.Router();

// Get all tables (Read All)
router.get("/", async (req, res) => {
    try {
        console.log("[CRUD] Fetching all tables");
        const tables = await table.getAll();
        res.json(tables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Find table by ID (Find)
router.get("/tables/:id", async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`[CRUD] Finding table by ID: ${id}`);
        const foundTable = await table.getById(id);
        if (!foundTable) {
            return res.status(404).json({ error: `Table with ID ${id} not found` });
        }
        res.json(foundTable);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
