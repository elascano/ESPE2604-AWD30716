const express = require("express");
const router = express.Router();

const DB_URL = "http://localhost:5000/db/customers";

router.get("/customers", async (req, res) => {
    try {
        const response = await fetch(DB_URL);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/customer/:id", async (req, res) => {
    try {
        const response = await fetch(`${DB_URL}/${req.params.id}`);
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
