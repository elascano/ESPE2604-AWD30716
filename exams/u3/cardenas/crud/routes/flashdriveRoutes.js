const express = require("express");
const FlashDrive = require("../models/flashdrive");
const router = express.Router();

router.get("/flashes", async (request, response) => {
    try {
        const flashesRecords = await FlashDrive.find();
        response.json(flashesRecords);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.get("/flashes/:name", async (request, response) => {
    try {
        const flashDriveRecord = await FlashDrive.findOne({ name: request.params.name });
        if (!flashDriveRecord) {
            return response.status(404).json({ status: 404, error: "FlashDrive not found" });
        }
        response.json(flashDriveRecord);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.post("/flashes", async (request, response) => {
    try {
        const newFlash = new FlashDrive({
            name: request.body.name,
            expiration_date: request.body.expiration_date,
            price: request.body.price,
        });
        const savedFlash = await newFlash.save();
        response.status(201).json(savedFlash);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

module.exports = router;