const express = require("express");
const Food = require("../models/food");
const router = express.Router();

// Get all foods
router.get("/foods", async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;