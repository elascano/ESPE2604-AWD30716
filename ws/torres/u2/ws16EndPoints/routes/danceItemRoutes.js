const express = require("express");
const DanceItem = require("../models/danceItem");

const router = express.Router();

const demoItems = [
  {
    id: 1601,
    name: "Urban Training Sneakers",
    category: "footwear",
    size: "40",
    price: 68.5,
    stock: 12,
    available: true
  },
  {
    id: 1602,
    name: "Stage Practice Hoodie",
    category: "clothing",
    size: "M",
    price: 34.99,
    stock: 9,
    available: true
  },
  {
    id: 1603,
    name: "Performance Knee Pads",
    category: "accessory",
    size: "Standard",
    price: 18.25,
    stock: 20,
    available: true
  }
];

function isDemoMode(req) {
  return req.app.locals.serverState.demoMode;
}

router.get("/items", async (req, res) => {
  try {
    if (isDemoMode(req)) {
      return res.json(demoItems);
    }

    const items = await DanceItem.find().sort({ id: 1 });
    res.json(items.length > 0 ? items : demoItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/item/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const item = isDemoMode(req)
      ? demoItems.find((demoItem) => demoItem.id === id)
      : (await DanceItem.findOne({ id })) || demoItems.find((demoItem) => demoItem.id === id);

    if (!item) {
      return res.status(404).json({ message: "Dance item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/items/category/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const items = isDemoMode(req)
      ? demoItems.filter((item) => item.category.toLowerCase() === category)
      : await DanceItem.find({ category: new RegExp(`^${category}$`, "i") }).sort({ id: 1 });

    res.json(items.length > 0 ? items : demoItems.filter((item) => item.category.toLowerCase() === category));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/item", async (req, res) => {
  try {
    if (isDemoMode(req)) {
      return res.status(503).json({
        message: "POST is disabled in demo mode because MongoDB is not connected."
      });
    }

    const item = new DanceItem(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
