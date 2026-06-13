const express = require("express");
const router = express.Router();

const DB_URL = "http://localhost:5000/db/customers";

router.put("/customer/:id", async (req, res) => {
    try {
        const response = await fetch(`${DB_URL}/${req.params.id}`, {
            method: "PUT",
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
