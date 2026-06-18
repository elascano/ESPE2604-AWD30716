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

module.exports = router;
