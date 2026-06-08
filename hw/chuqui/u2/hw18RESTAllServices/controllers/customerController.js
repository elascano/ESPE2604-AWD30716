const Customer = require("../models/customer");

// GET all customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST a new customer
exports.createCustomer = async (req, res) => {
    const customer = new Customer({
        id: req.body.id,
        fullName: req.body.fullName,
        email: req.body.email,
        type: req.body.type,
        discount: req.body.discount,
        totalSale: req.body.totalSale
    });

    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT (update) customer by ID
exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        if (req.body.id !== undefined) customer.id = req.body.id;
        if (req.body.fullName !== undefined) customer.fullName = req.body.fullName;
        if (req.body.email !== undefined) customer.email = req.body.email;
        if (req.body.type !== undefined) customer.type = req.body.type;
        if (req.body.discount !== undefined) customer.discount = req.body.discount;
        if (req.body.totalSale !== undefined) customer.totalSale = req.body.totalSale;

        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE customer by ID
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        await Customer.deleteOne({ _id: req.params.id });
        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
