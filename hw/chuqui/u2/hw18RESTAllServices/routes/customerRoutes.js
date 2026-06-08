const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// GET all customers
router.get("/customers", customerController.getCustomers);

// GET customer by ID
router.get("/customers/:id", customerController.getCustomerById);

// POST a new customer
router.post("/customers", customerController.createCustomer);

// PUT (update) customer by ID
router.put("/customers/:id", customerController.updateCustomer);

// DELETE customer by ID
router.delete("/customers/:id", customerController.deleteCustomer);

module.exports = router;