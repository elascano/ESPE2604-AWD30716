const express = require("express");
const customer = require("../models/customer");
const router = express.Router();

router.get("/customers", async (req, res) => {
    try{
        const customers = await customer.find();
        res.json(customers);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});


router.get("/customer/totalSale", async (req, res) => {
    try {
        const customers = await customer.find();
        const total = customers.reduce((sum, c) => sum + (c.moneySpent || 0), 0);
        res.json({ totalSale: total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/customer/:id', async (req, res) => {
    try{
        const customerObject = await customer.findOne({id: req.params.id});
        if(customerObject == null){
            res.status(400).json({status: 404});
        }else{
            res.json(customerObject);
        }

    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.post("/customer", async (req, res) => {
    const { id, name, age, moneySpent } = req.body;
    if (id === undefined || id === null) {
        return res.status(400).json({ message: "El ID del cliente es requerido." });
    }
    try {
        const existingCustomer = await customer.findOne({ id: id });
        if (existingCustomer) {
            return res.status(400).json({ message: `El cliente con ID ${id} ya existe.` });
        }
        const newCustomer = new customer({ id, name, age, moneySpent });
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/customer/:id", async (req, res) => {
    const { name, age, moneySpent } = req.body;
    try {
        const updatedCustomer = await customer.findOneAndUpdate(
            { id: req.params.id },
            { name, age, moneySpent },
            { returnDocument: 'after' }
        );
        if (!updatedCustomer) {
            return res.status(404).json({ message: "Cliente no encontrado." });
        }
        res.json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/customer/:id", async (req, res) => {
    try {
        const deletedCustomer = await customer.findOneAndDelete({ id: req.params.id });
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Cliente no encontrado." });
        }
        res.json({ message: "Cliente eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
