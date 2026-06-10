const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

// Route to get the top 3 best games based on rank (highest grading)
router.get("/games/sorted", gameController.getSortedGames);

// Route to get games by rank
router.get("/game/:rank", gameController.getGamesByRank);

// Standard routes
router.get("/games", gameController.getAllGames);
router.post("/games", gameController.createGame);

module.exports = router;
