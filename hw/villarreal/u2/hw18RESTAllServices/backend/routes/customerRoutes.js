const express = require("express");
const customer = require("../models/customer");
const router = express.Router();

router.get("/customers", async (req, res) => {
    try {
        const customers = await customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/customer/:id", async (req, res) => {
    try {
        const customerObject = await customer.findOne({ id: Number(req.params.id) });
        if (customerObject == null) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json(customerObject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/customers", async (req, res) => {
    try {
        const { id, name, age, moneySpent } = req.body;
        if (!id || !name) {
            return res.status(400).json({ message: "id and name are required" });
        }
        const existing = await customer.findOne({ id: Number(id) });
        if (existing) {
            return res.status(409).json({ message: "Customer with this id already exists" });
        }
        const newCustomer = new customer({
            id: Number(id),
            name,
            age: age ? Number(age) : undefined,
            moneySpent: moneySpent ? Number(moneySpent) : undefined
        });
        const saved = await newCustomer.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/customer/:id", async (req, res) => {
    try {
        const { name, age, moneySpent } = req.body;
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (age !== undefined) updateData.age = Number(age);
        if (moneySpent !== undefined) updateData.moneySpent = Number(moneySpent);

        const updated = await customer.findOneAndUpdate(
            { id: Number(req.params.id) },
            updateData,
            { new: true, runValidators: true }
        );
        if (updated == null) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/customer/:id", async (req, res) => {
    try {
        const deleted = await customer.findOneAndDelete({ id: Number(req.params.id) });
        if (deleted == null) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json({ message: "Customer deleted", customer: deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
