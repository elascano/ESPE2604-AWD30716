const express = require("express");
const Customer = require("../models/customer");
const router = express.Router();

// GET all customers
router.get("/customers", async(req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET total money spent
router.get("/customers/total", async(req, res) => {
    try {
        const result = await Customer.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $convert: {
                                input: "$totalSale",
                                to: "double",
                                onError: 0,
                                onNull: 0
                            }
                        }
                    }
                }
            }
        ]);
        const total = result.length ? result[0].total : 0;
        res.json({ total });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET customer by ID
router.get("/customers/:id", async(req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (customer == null) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;