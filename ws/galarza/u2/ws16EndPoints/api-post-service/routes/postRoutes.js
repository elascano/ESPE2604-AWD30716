const express = require("express");
const router = express.Router();

const DB_URL = "http://localhost:5000/db/customers";

router.post("/customer", async (req, res) => {
    try {
        const response = await fetch(DB_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
