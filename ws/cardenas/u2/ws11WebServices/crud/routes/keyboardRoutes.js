const express = require("express");
const Keyboard = require("../models/keyboard");
const router = express.Router();

router.get("/keyboards", async (request, response) => {
    try {
        const keyboardRecords = await Keyboard.find();
        response.json(keyboardRecords);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.get("/keyboards/:id", async (request, response) => {
    try {
        const keyboardRecord = await Keyboard.findOne({ id: request.params.id });
        if (!keyboardRecord) {
            return response.status(404).json({ status: 404, error: "Keyboard not found" });
        }
        response.json(keyboardRecord);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.post("/keyboards", async (request, response) => {
    try {
        const newKeyboard = new Keyboard({
            id: request.body.id,
            model_name: request.body.model_name,
            release_date: request.body.release_date,
            price_usd: request.body.price_usd,
            is_mechanical: request.body.is_mechanical,
            warranty_months: request.body.warranty_months,
            features_list: request.body.features_list  
        });
        const savedKeyboard = await newKeyboard.save();
        response.status(201).json(savedKeyboard);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.put("/keyboards/:id", async (request, response) => {
    try {
        const updatedKeyboard = await Keyboard.findOneAndUpdate(
            { id: request.params.id },
            {
                model_name: request.body.model_name,
                release_date: request.body.release_date,
                price_usd: request.body.price_usd,
                is_mechanical: request.body.is_mechanical,
                warranty_months: request.body.warranty_months,
                features_list: request.body.features_list 
            },
            { new: true }
        );
        if (!updatedKeyboard) {
            return response.status(404).json({ status: 404, error: "Keyboard not found to update" });
        }
        response.json(updatedKeyboard);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.delete("/keyboards/:id", async (request, response) => {
    try {
        const deletedKeyboard = await Keyboard.findOneAndDelete({ id: request.params.id });
        if (!deletedKeyboard) {
            return response.status(404).json({ status: 404, error: "Keyboard not found to delete" });
        }
        response.json({ status: 200, message: "Keyboard record deleted successfully" });
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

module.exports = router;