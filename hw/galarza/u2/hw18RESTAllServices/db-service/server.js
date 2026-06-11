require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Customer = require("./models/Customer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.get("/db/customers", async (req, res) => {
    try {
        const data = await Customer.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/db/customers/:id", async (req, res) => {
    try {
        const data = await Customer.findOne({ id: req.params.id });
        if (!data) return res.status(404).json({ error: "Not found" });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/db/customers", async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put("/db/customers/:id", async (req, res) => {
    try {
        const updatedCustomer = await Customer.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedCustomer) return res.status(404).json({ error: "Not found" });
        res.json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete("/db/customers/:id", async (req, res) => {
    try {
        const deletedCustomer = await Customer.findOneAndDelete({ id: req.params.id });
        if (!deletedCustomer) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT);
