const express = require("express");
const mongoose = require("mongoose");
const soccerPlayer = require("../models/soccerPlayer");
const router = express.Router();

router.get("/customers", async (req, res) => {
  try {
    const soccerPlayers = await soccerPlayer.find().sort({ id: 1, createdAt: -1 }).lean();
    res.json(soccerPlayers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get("/soccerPlayer/:id", async (req, res) => {
  try {
    const soccerPlayer = await findsoccerPlayer(req.params.id);

    if (!soccerPlayer) {
      return res.status(404).json({ message: "soccer Player not found" });
    }

    res.json(soccerPlayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get("/soccerPlayer/:id", async (req, res) => {
  try {
    const soccerPlayer = await findsoccerPlayer(req.params.id);

    if (!soccerPlayer) {
      return res.status(404).json({ message: "soccer player not found" });
    }

    res.json(soccerPlayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





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



module.exports = router;
