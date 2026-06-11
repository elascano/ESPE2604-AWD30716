const express = require("express");
const Customer = require("../models/customer");

const router = express.Router();

router.get("/customer", async (req, res) => {
  try {
    if (isDisconnected()) {
      return res.json(demoCustomers());
    }

    const customers = await Customer.find().sort({ id: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customer/count", async (req, res) => {
  try {
    if (isDisconnected()) {
      return res.json({ total: demoCustomers().length });
    }

    const total = await Customer.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customer/revenue", async (req, res) => {
  try {
    if (isDisconnected()) {
      return res.json({ total: demoCustomers().reduce((sum, customer) => sum + customer.moneySpent, 0) });
    }

    const result = await Customer.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$moneySpent" }
        }
      }
    ]);

    res.json({ total: result[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customer/summary", async (req, res) => {
  try {
    if (isDisconnected()) {
      const summary = demoCustomers().map((customer) => ({
        _id: customer.name,
        count: 1,
        totalSpent: customer.moneySpent
      }));
      return res.json(summary);
    }

    const summary = await Customer.aggregate([
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
          totalSpent: { $sum: "$moneySpent" }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customer/name/:name", async (req, res) => {
  try {
    if (isDisconnected()) {
      const customerObject = demoCustomers().find((customer) => customer.name.toLowerCase() === req.params.name.toLowerCase());

      if (customerObject == null) {
        return res.status(404).json({ message: "Customer not found" });
      }

      return res.json(customerObject);
    }

    const customerObject = await Customer.findOne({
      name: new RegExp(`^${escapeRegExp(req.params.name)}$`, "i")
    });

    if (customerObject == null) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customerObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customer/age/:age", async (req, res) => {
  try {
    const age = Number(req.params.age);

    if (Number.isNaN(age)) {
      return res.status(400).json({ message: "Age must be numeric" });
    }

    if (isDisconnected()) {
      return res.json(demoCustomers().filter((customer) => customer.age === age));
    }

    const customers = await Customer.find({ age }).sort({ name: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customer/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Customer id must be numeric" });
    }

    if (isDisconnected()) {
      const customerObject = demoCustomers().find((customer) => customer.id === id);

      if (customerObject == null) {
        return res.status(404).json({ message: "Customer not found" });
      }

      return res.json(customerObject);
    }

    const customerObject = await Customer.findOne({ id });

    if (customerObject == null) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customerObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isDisconnected() {
  return Customer.db.readyState !== 1;
}

function demoCustomers() {
  return [
    { id: 101, name: "Carlos Torres", age: 24, moneySpent: 420 },
    { id: 102, name: "Evelyn Villarreal", age: 23, moneySpent: 385 },
    { id: 103, name: "American Latin Class", age: 5, moneySpent: 960 }
  ];
}

module.exports = router;
