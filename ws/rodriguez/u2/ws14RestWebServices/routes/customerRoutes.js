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
        customerObject = await customer.findOne({id : req.params.id});
        if (customerObject == null) {
            res.status(404).json({ status: 404, message: "Customer not found" });
        } else {
            res.json(customerObject);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;