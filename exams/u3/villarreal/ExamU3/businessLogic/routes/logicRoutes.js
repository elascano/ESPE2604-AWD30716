const express = require("express");
const router = express.Router();
const Mask = require("../../crud/models/mask");

const calculateTotalUnits = async () => {
  const masks = await Mask.find();
  const total = masks.reduce((sum, mask) => sum + (mask.units || 0), 0);
  return total;
};

router.get("/total-units", async (req, res) => {
  try {
    const total = await calculateTotalUnits();
    res.json({ totalUnits: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/cart-total", (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid products array" });
    }
    const total = products.reduce((sum, product) => sum + (product.price || 0), 0);
    res.json({ total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/iva", (req, res) => {
  try {
    const { product } = req.body;
    if (!product) {
      return res.status(400).json({ message: "Product is required" });
    }
    const iva = (product.price || 0) * 0.16;
    res.json({ iva });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/expiration", (req, res) => {
  try {
    const { product, expirationDate } = req.body;
    if (!product || !expirationDate) {
      return res.status(400).json({ message: "Product and expirationDate are required" });
    }
    const { day, month, year } = expirationDate;
    const expDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    expDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const diffTime = expDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    res.json({ daysLeft: diffDays });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
