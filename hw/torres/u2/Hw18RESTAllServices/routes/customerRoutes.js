const express = require("express");
const Customer = require("../models/customer");

const router = express.Router();
const demoCustomers = [
  { id: 3016, name: "Carlos Torres", age: 24, moneySpent: 180.75 },
  { id: 3017, name: "Evelyn Villarreal", age: 23, moneySpent: 220.4 },
  { id: 3018, name: "Computer Store Demo", age: 5, moneySpent: 560 }
];

router.get("/customers", async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json(sortCustomers(demoCustomers));
    }

    const customers = await Customer.find().sort({ id: 1, name: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customer/:id", async (req, res) => {
  try {
    const id = parseCustomerId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: "Customer id must be numeric." });
    }

    const customer = isDemoMode()
      ? demoCustomers.find((item) => item.id === id)
      : await Customer.findOne({ id });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customers/totalSpent", async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({ total: calculateTotal(demoCustomers) });
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

router.post("/customer", async (req, res) => {
  try {
    const data = validateCustomerPayload(req.body);

    if (isDemoMode()) {
      if (demoCustomers.some((customer) => customer.id === data.id)) {
        return res.status(409).json({ message: "A customer with this id already exists." });
      }

      demoCustomers.push(data);
      return res.status(201).json(data);
    }

    const existingCustomer = await Customer.findOne({ id: data.id });
    if (existingCustomer) {
      return res.status(409).json({ message: "A customer with this id already exists." });
    }

    const customer = await Customer.create(data);
    res.status(201).json(customer);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
});

router.put("/customer/:id", async (req, res) => {
  try {
    const id = parseCustomerId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: "Customer id must be numeric." });
    }

    const data = validateCustomerPayload({ ...req.body, id });

    if (isDemoMode()) {
      const index = demoCustomers.findIndex((customer) => customer.id === id);
      if (index === -1) {
        return res.status(404).json({ message: "Customer not found." });
      }

      demoCustomers[index] = data;
      return res.json(demoCustomers[index]);
    }

    const customer = await Customer.findOneAndUpdate({ id }, data, {
      new: true,
      runValidators: true
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.json(customer);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
});

router.patch("/customer/:id", async (req, res) => {
  try {
    const id = parseCustomerId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: "Customer id must be numeric." });
    }

    const data = validatePartialPayload(req.body);

    if (isDemoMode()) {
      const customer = demoCustomers.find((item) => item.id === id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found." });
      }

      Object.assign(customer, data);
      return res.json(customer);
    }

    const customer = await Customer.findOneAndUpdate({ id }, data, {
      new: true,
      runValidators: true
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.json(customer);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
});

router.delete("/customer/:id", async (req, res) => {
  try {
    const id = parseCustomerId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: "Customer id must be numeric." });
    }

    if (isDemoMode()) {
      const index = demoCustomers.findIndex((customer) => customer.id === id);
      if (index === -1) {
        return res.status(404).json({ message: "Customer not found." });
      }

      const [deletedCustomer] = demoCustomers.splice(index, 1);
      return res.json({ message: "Customer deleted.", data: deletedCustomer });
    }

    const customer = await Customer.findOneAndDelete({ id });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.json({ message: "Customer deleted.", data: customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function isDemoMode() {
  return Customer.db.readyState !== 1;
}

function sortCustomers(customers) {
  return [...customers].sort((left, right) => left.id - right.id);
}

function calculateTotal(customers) {
  return customers.reduce((total, customer) => total + Number(customer.moneySpent || 0), 0);
}

function parseCustomerId(value) {
  const id = Number(value);
  return Number.isInteger(id) ? id : null;
}

function validateCustomerPayload(payload) {
  const id = parseCustomerId(payload.id);
  const name = String(payload.name || "").trim();
  const age = Number(payload.age);
  const moneySpent = Number(payload.moneySpent);

  if (id === null) {
    throw validationError("Customer id is required and must be an integer.");
  }

  if (!name) {
    throw validationError("Customer name is required.");
  }

  if (!Number.isFinite(age) || age < 0) {
    throw validationError("Customer age is required and must be zero or greater.");
  }

  if (!Number.isFinite(moneySpent) || moneySpent < 0) {
    throw validationError("Money spent is required and must be zero or greater.");
  }

  return { id, name, age, moneySpent };
}

function validatePartialPayload(payload) {
  const data = {};

  if (Object.hasOwn(payload, "name")) {
    data.name = String(payload.name || "").trim();
    if (!data.name) {
      throw validationError("Customer name cannot be empty.");
    }
  }

  if (Object.hasOwn(payload, "age")) {
    data.age = Number(payload.age);
    if (!Number.isFinite(data.age) || data.age < 0) {
      throw validationError("Customer age must be zero or greater.");
    }
  }

  if (Object.hasOwn(payload, "moneySpent")) {
    data.moneySpent = Number(payload.moneySpent);
    if (!Number.isFinite(data.moneySpent) || data.moneySpent < 0) {
      throw validationError("Money spent must be zero or greater.");
    }
  }

  if (Object.keys(data).length === 0) {
    throw validationError("At least one editable field is required.");
  }

  return data;
}

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

module.exports = router;
