const express = require("express");
const customer = require("../models/customer");
const router = express.Router();

//Get all Customers
router.get("/customer", async (req, res) => {

    try{
        const customers = await customer.find();
        res.json(customers);
    }catch (err) {
        res.status(500).json({message: err.message});
    }
});

//Get customer by CustomerId
router.get('/customer/:id', async (req, res) => {
    try{
        const customerObject = await customer.findOne({id: req.params.id});
        if (customerObject == null){
            res.status(400).json({status: 404});
        }else{
            res.json(customerObject);
        }
    }
    catch(error){
        res.status(500).json({message: err.message});
    }

});

module.exports = router;