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

// POST create a new customer
router.post("/customers", async (req, res) => {
    try {
        const lastCustomer = await Customer.findOne().sort({ id: -1 });
        const nextId = lastCustomer && lastCustomer.id ? lastCustomer.id + 1 : 1;

        const customer = new Customer({
            id: nextId,
            fullName: req.body.fullName,
            email: req.body.email,
            type: req.body.type || "Normal",
            discount: Number(req.body.discount) || 0,
            totalSale: Number(req.body.totalSale) || 0
        });

        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update customer by Mongo ID (_id)
router.put("/customers/:id", async (req, res) => {
    try {
        const updateData = {};
        if (req.body.fullName !== undefined) updateData.fullName = req.body.fullName;
        if (req.body.email !== undefined) updateData.email = req.body.email;
        if (req.body.type !== undefined) updateData.type = req.body.type;
        if (req.body.discount !== undefined) updateData.discount = Number(req.body.discount);
        if (req.body.totalSale !== undefined) updateData.totalSale = Number(req.body.totalSale);

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (updatedCustomer == null) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE customer by Mongo ID (_id)
router.delete("/customers/:id", async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (deletedCustomer == null) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;