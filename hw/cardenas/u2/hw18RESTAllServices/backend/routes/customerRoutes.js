const express = require("express");
const Customer = require("../models/customer");
const router = express.Router();

router.get("/customers", async (request, response) => {
    try {
        const customerRecords = await Customer.find();
        response.json(customerRecords);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.get("/customer/:id", async (request, response) => {
    try {
        const customerRecord = await Customer.findOne({ id: request.params.id });
        if (!customerRecord) {
            return response.status(404).json({ status: 404, error: "Customer not found" });
        }
        response.json(customerRecord);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.post("/customer", async (request, response) => {
    try {
        const newCustomer = new Customer({
            id: request.body.id,
            name: request.body.name,
            age: request.body.age,
            moneySpent: request.body.moneySpent
        });
        const savedCustomer = await newCustomer.save();
        response.status(201).json(savedCustomer);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.put("/customer/:id", async (request, response) => {
    try {
        const updatedCustomer = await Customer.findOneAndUpdate(
            { id: request.params.id },
            {
                name: request.body.name,
                age: request.body.age,
                moneySpent: request.body.moneySpent
            },
            { new: true }
        );
        if (!updatedCustomer) {
            return response.status(404).json({ status: 404, error: "Customer not found to update" });
        }
        response.json(updatedCustomer);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.delete("/customer/:id", async (request, response) => {
    try {
        const deletedCustomer = await Customer.findOneAndDelete({ id: request.params.id });
        if (!deletedCustomer) {
            return response.status(404).json({ status: 404, error: "Customer not found to delete" });
        }
        response.json({ status: 200, message: "Customer record deleted successfully" });
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

module.exports = router;