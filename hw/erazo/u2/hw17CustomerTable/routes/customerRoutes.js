const express = require('express');
const customer = require('../models/customer');
const router = express.Router();

router.get('/customers', async (req, res) => {
    try {
        const customers = await customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/customer/:id', async (req, res) => {
    try {
        const customerObject = await customer.findOne({id : req.params.id});
        if (customerObject == null) {
            res.status(404).json({ status: 404, message: "Customer not found" });
        } else {
            res.json(customerObject);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/customers/totalSpent', async (req, res) => {
    try {
        const totalSpent = await customer.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: { $ifNull: ["$moneySpent", "$totalSale"] } }
                }
            }
        ]);
        res.json({ total: totalSpent[0]?.total || 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/customer', async (req, res) => {
    try {
        const newCustomer = new customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
