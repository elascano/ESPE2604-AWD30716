const express = require("express");
const router = express.Router();
const Medicine = require("../models/medicine");


router.post("/", async (req, res) => {
    try {

        const newMedicines = await Medicine.insertMany(req.body);


        res.status(201).json({
            code: 201,
            message: "Medicine inserted",
            data: newMedicines
        });
    } catch (error) {

        res.status(500).json({
            code: 500,
            message: "Server not responding",
            error: error.message
        });
    }
});


router.get("/", async (req, res) => {
    try {

        const medicines = await Medicine.find();


        res.status(200).json({
            code: 200,
            message: "Medicines retrieved successfully",
            data: medicines
        });
    } catch (error) {

        res.status(500).json({
            code: 500,
            message: "Error retrieving medicines",
            error: error.message
        });
    }
});

module.exports = router;