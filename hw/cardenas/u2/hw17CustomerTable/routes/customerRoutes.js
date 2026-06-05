const express = require("express");
const customer = require("../models/customer");
const router = express.Router();
router.get("/customers", async (req, res) => {
    try{
        const customers = await customer.find();
        res.json(customers);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/customer/:id', async (req, res) =>{
    try{
        const customerObject = await customer.findOne({ id: req.params.id });
        if(customerObject == null) {
            res.status(400).json({status: 404});
        } else {
            res.json(customerObject);
        }
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/totalspent", async (req, res) => {
    try {
        const calculatedTotalSpent = await customer.aggregate([
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: "$moneySpent" }
                }
            }
        ]);
        
        if (calculatedTotalSpent.length > 0) {
            res.json({ totalSpentFromCustomers: calculatedTotalSpent[0].totalSpent });
        } else {
            res.json({ totalSpentFromCustomers: 0 });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/customers/dashboard", async (req, res) => {
    try {
        res.render("customers");
    } catch (routeError) {
        res.status(500).json({ error: "System was unable to build the view layout template" });
    }
});

module.exports = router;