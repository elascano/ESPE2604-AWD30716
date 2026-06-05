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

module.exports = router;
