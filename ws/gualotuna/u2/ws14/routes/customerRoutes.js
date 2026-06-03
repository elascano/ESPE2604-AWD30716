const express = require("express");
const customer = require("../models/customer");
const router = express.Router();

//GET all customers
router.get("/customers", async (req, res) => {
    try {
        const customers = await customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//GET customer by CustomerID
router.get("/customers/:id", async (req, res) => {
    try {
        const customers = await customer.findOne({ id: req.params.id });
        if (customers == null) {
            res.status(400).json({ status: 404 });
        } else {
            res.json(customers);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;