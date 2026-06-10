const express = require("express");
const mongoose = require("mongoose");
const SoccerPlayer = require("../models/soccerPlayer");

const router = express.Router();

const sortableFields = new Set([
  "id",
  "name",
  "club",
  "country",
  "age",
  "goals",
  "assist",
  "assists",
  "contributions",
]);

function calculateContributions(player) {
  return (Number(player.goals) || 0) + (Number(player.assist) || 0);
}

function formatPlayer(player, rank) {
  return {
    ...(rank != null ? { rank } : {}),
    _id: player._id,
    id: player.id,
    name: player.name,
    description: player.description,
    club: player.club,
    country: player.country,
    age: player.age,
    goals: player.goals || 0,
    assist: player.assist || 0,
    contributions: calculateContributions(player),
  };
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

function buildFilter(query) {
  const filter = {};

  for (const field of ["name", "club", "country"]) {
    if (query[field]) {
      filter[field] = { $regex: query[field], $options: "i" };
    }
  }

  for (const field of ["age", "goals", "assist", "contributions"]) {
    const value = Number(query[field]);
    if (!Number.isNaN(value)) {
      filter[field] = value;
    }
  }

  const assists = Number(query.assists);
  if (!Number.isNaN(assists)) {
    filter.assist = assists;
  }

  return filter;
}

function buildSort(query) {
  const requestedField = query.sortBy || "id";
  const field = requestedField === "assists" ? "assist" : requestedField;
  const direction = String(query.order).toLowerCase() === "desc" ? -1 : 1;

  if (!sortableFields.has(requestedField)) {
    return { id: 1 };
  }

  return { [field]: direction, id: 1 };
}

async function updateStoredContributions(players) {
  const operations = players
    .filter((player) => player.contributions !== calculateContributions(player))
    .map((player) => ({
      updateOne: {
        filter: { _id: player._id },
        update: { $set: { contributions: calculateContributions(player) } },
      },
    }));

  if (operations.length > 0) {
    await SoccerPlayer.bulkWrite(operations);
  }
}

function findSoccerPlayer(id) {
  return SoccerPlayer.findOne(buildIdentifierQuery(id)).lean();
}

// GET /soccerPlayers
router.get(["/soccerPlayers", "/soccerPlayer"], async (req, res) => {
  try {
    const players = await SoccerPlayer.find(buildFilter(req.query))
      .sort(buildSort(req.query))
      .lean();

    await updateStoredContributions(players);
    res.json(players.map((player) => formatPlayer(player)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /soccerPlayers/rankings/top-player-goals
router.get(
  ["/soccerPlayers/rankings/top-player-goals", "/soccerPlayers/topPlayerGoals"],
  async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 30;
      const players = await SoccerPlayer.find()
        .sort({ goals: -1, id: 1 })
        .limit(limit)
        .lean();

      await updateStoredContributions(players);
      res.json(players.map((player, index) => formatPlayer(player, index + 1)));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET /soccerPlayers/rankings/top-contributors
router.get(
  ["/soccerPlayers/rankings/top-contributors", "/soccerPlayers/topContributors"],
  async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 30;
      const players = await SoccerPlayer.aggregate([
        {
          $addFields: {
            calculatedContributions: {
              $add: [{ $ifNull: ["$goals", 0] }, { $ifNull: ["$assist", 0] }],
            },
          },
        },
        { $sort: { calculatedContributions: -1, id: 1 } },
        { $limit: limit },
      ]);

      await updateStoredContributions(players);
      res.json(players.map((player, index) => formatPlayer(player, index + 1)));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET /soccerPlayers/:id
router.get(["/soccerPlayers/:id", "/soccerPlayer/:id"], async (req, res) => {
  try {
    const player = await findSoccerPlayer(req.params.id);

    if (!player) {
      return res.status(404).json({ message: "Soccer player not found" });
    }

    await updateStoredContributions([player]);
    res.json(formatPlayer(player));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /soccerPlayers/:id/contributions
router.get(
  ["/soccerPlayers/:id/contributions", "/soccerPlayer/:id/contributions"],
  async (req, res) => {
    try {
      const player = await findSoccerPlayer(req.params.id);

      if (!player) {
        return res.status(404).json({ message: "Soccer player not found" });
      }

      await updateStoredContributions([player]);
      res.json({
        id: player.id,
        name: player.name,
        goals: player.goals || 0,
        assist: player.assist || 0,
        contributions: calculateContributions(player),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
