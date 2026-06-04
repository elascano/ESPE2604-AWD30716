const express = require("express");
const Customer = require("../models/customer");
const router = express.Router();

// Get all customers
router.get("/customers", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get customer by id
router.get("/customer/:id", async (req, res) => {
    try {
        const customerObject = await Customer.findOne({ id: Number(req.params.id) });

        if (customerObject == null) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(customerObject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;