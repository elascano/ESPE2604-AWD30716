const Game = require("../models/game");

// GET all games
exports.getAllGames = async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST a new game
exports.createGame = async (req, res) => {
    const newGame = new Game({
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        owner: req.body.owner,
        num_players: req.body.num_players,
        grading: req.body.grading
    });

    try {
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET top 3 games sorted by grading
exports.getSortedGames = async (req, res) => {
    try {
        // Since rank is determined by grading (0-10), the top 3 best games based on rank
        // correspond to the top 3 games with the highest grading.
        const games = await Game.find().sort({ grading: -1 }).limit(3);
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET games by rank
exports.getGamesByRank = async (req, res) => {
    try {
        const rank = req.params.rank;
        // Case-insensitive query to find games by rank
        const games = await Game.find({ rank: { $regex: new RegExp("^" + rank + "$", "i") } });
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
