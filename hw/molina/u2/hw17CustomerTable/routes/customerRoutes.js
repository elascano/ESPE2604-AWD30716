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

// Get customer names
router.get("/customers/name", async (req, res) => {
    try {
        const customers = await Customer.find({}, "id name -_id");
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get customer ages
router.get("/customers/age", async (req, res) => {
    try {
        const customers = await Customer.find({}, "id name age -_id");
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get customer money spent
router.get("/customers/money-spent", async (req, res) => {
    try {
        const customers = await Customer.find({}, "id name moneySpent -_id");
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get total money spent by all customers
router.get("/customers/money-spent/total", async (req, res) => {
    try {
        const result = await Customer.aggregate([
            {
                $group: {
                    _id: null,
                    totalMoneySpent: { $sum: "$moneySpent" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalMoneySpent: 1
                }
            }
        ]);

        res.json(result[0] || {
            totalMoneySpent: 0
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get total customers
router.get("/customers/count", async (req, res) => {
    try {
        const totalCustomers = await Customer.countDocuments();

        res.json({
            totalCustomers: totalCustomers
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get customers summary
router.get("/customers/summary", async (req, res) => {
    try {
        const result = await Customer.aggregate([
            {
                $group: {
                    _id: null,
                    totalCustomers: { $sum: 1 },
                    totalMoneySpent: { $sum: "$moneySpent" },
                    averageMoneySpent: { $avg: "$moneySpent" },
                    averageAge: { $avg: "$age" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalCustomers: 1,
                    totalMoneySpent: 1,
                    averageMoneySpent: 1,
                    averageAge: 1
                }
            }
        ]);

        res.json(result[0] || {
            totalCustomers: 0,
            totalMoneySpent: 0,
            averageMoneySpent: 0,
            averageAge: 0
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get customers by name
router.get("/customers/name/:name", async (req, res) => {
    try {
        const { name } = req.params;

        const customers = await Customer.find({
            name: { $regex: name, $options: "i" }
        });

        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get customers by age
router.get("/customers/age/:age", async (req, res) => {
    try {
        const age = Number(req.params.age);

        if (Number.isNaN(age)) {
            return res.status(400).json({
                message: "Age must be a number"
            });
        }

        const customers = await Customer.find({
            age: age
        });

        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get customers by money spent range
router.get("/customers/money-spent/range/:min/:max", async (req, res) => {
    try {
        const min = Number(req.params.min);
        const max = Number(req.params.max);

        if (Number.isNaN(min) || Number.isNaN(max)) {
            return res.status(400).json({
                message: "Minimum and maximum money spent must be numbers"
            });
        }

        if (min > max) {
            return res.status(400).json({
                message: "Minimum money spent cannot be greater than maximum money spent"
            });
        }

        const customers = await Customer.find({
            moneySpent: {
                $gte: min,
                $lte: max
            }
        });

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