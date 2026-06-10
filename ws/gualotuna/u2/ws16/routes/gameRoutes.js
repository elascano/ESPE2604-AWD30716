const express = require("express");
const game = require("../models/game");
const router = express.Router();


router.get("/games", async (req, res) => {
    try {
        const games = await game.find();
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/games", async (req, res) => {
    const newGame = new game({
        name: req.body.name,
        owner: req.body.owner,
        age: req.body.age,
        genre: req.body.genre,
        platforms: req.body.platforms,
        multiplayer: req.body.multiplayer
    });

    try {
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
