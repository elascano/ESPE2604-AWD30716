const express = require("express");
const Customer = require("../models/customer");

const router = express.Router();

router.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customer/:id", async (req, res) => {
  try {
    const customerObject = await Customer.findOne({ id: Number(req.params.id) });

    if (customerObject == null) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customerObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
