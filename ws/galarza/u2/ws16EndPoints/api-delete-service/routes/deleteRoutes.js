const express = require("express");
const router = express.Router();

const DB_URL = "http://localhost:3008/db/watches";

router.delete("/watch/:id", async (req, res) => {
    try {
        const response = await fetch(`${DB_URL}/${req.params.id}`, {
            method: "DELETE"
        });
        
        const data = await response.json();
        
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;