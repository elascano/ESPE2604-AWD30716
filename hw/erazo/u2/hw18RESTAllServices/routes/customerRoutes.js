const express = require("express");
const mongoose = require("mongoose");
const Customer = require("../models/customer");
const router = express.Router();

router.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ id: 1, createdAt: -1 }).lean();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customers/totalSpent", async (req, res) => {
  try {
    const totalSpent = await Customer.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $convert: {
                input: { $ifNull: ["$moneySpent", "$totalSale"] },
                to: "double",
                onError: 0,
                onNull: 0
              }
            }
          }
        }
      }
    ]);

    res.json({ total: totalSpent[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customers/:id", async (req, res) => {
  try {
    const customer = await findCustomer(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/customers", async (req, res) => {
  try {
    const lastCustomer = await Customer.findOne().sort({ id: -1 }).lean();
    const customer = new Customer({
      ...normalizeCustomerPayload(req.body),
      id: Number(lastCustomer?.id || 0) + 1
    });

    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/customers/:id", async (req, res) => {
  try {
    const updatedCustomer = await updateCustomer(req.params.id, normalizeCustomerPayload(req.body));

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/customers/:id", async (req, res) => {
  try {
    const deletedCustomer = await deleteCustomer(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully", customer: deletedCustomer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customer/:id", async (req, res) => {
  try {
    const customer = await findCustomer(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/customer", async (req, res) => {
  try {
    const lastCustomer = await Customer.findOne().sort({ id: -1 }).lean();
    const customer = new Customer({
      ...normalizeCustomerPayload(req.body),
      id: Number(lastCustomer?.id || 0) + 1
    });

    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

function normalizeCustomerPayload(body) {
  const payload = {};
  const textFields = ["name", "fullName", "email", "type"];
  const numberFields = ["age", "discount", "moneySpent", "totalSale"];

  textFields.forEach((field) => {
    if (body[field] !== undefined) {
      payload[field] = String(body[field]).trim();
    }
  });

  numberFields.forEach((field) => {
    if (body[field] !== undefined && body[field] !== "") {
      payload[field] = Number(body[field]);
    }
  });

  if (!payload.name && payload.fullName) {
    payload.name = payload.fullName;
  }

  if (!payload.fullName && payload.name) {
    payload.fullName = payload.name;
  }

  if (payload.moneySpent !== undefined && payload.totalSale === undefined) {
    payload.totalSale = payload.moneySpent;
  }

  if (payload.totalSale !== undefined && payload.moneySpent === undefined) {
    payload.moneySpent = payload.totalSale;
  }

  return payload;
}

function buildIdentifierQuery(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { _id: id };
  }

  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return { _id: null };
  }

  return { id: numericId };
}

function findCustomer(id) {
  return Customer.findOne(buildIdentifierQuery(id)).lean();
}

function updateCustomer(id, payload) {
  return Customer.findOneAndUpdate(buildIdentifierQuery(id), payload, {
    new: true,
    runValidators: true
  });
}

function deleteCustomer(id) {
  return Customer.findOneAndDelete(buildIdentifierQuery(id));
}

module.exports = router;
