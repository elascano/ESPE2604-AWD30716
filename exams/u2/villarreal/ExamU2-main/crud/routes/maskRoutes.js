const express = require("express");
const router = express.Router();
const Mask = require("../models/mask");

router.get("/", async (req, res) => {
    try {
        const masks = await Mask.find();
        res.json(masks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const mask = await Mask.findById(req.params.id);
        if (!mask) return res.status(404).json({ message: "Mask not found" });
        res.json(mask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const mask = await Mask.create(req.body);
        res.status(201).json(mask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const mask = await Mask.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!mask) return res.status(404).json({ message: "Mask not found" });
        res.json(mask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const mask = await Mask.findByIdAndDelete(req.params.id);
        if (!mask) return res.status(404).json({ message: "Mask not found" });
        res.json({ message: "Mask deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
