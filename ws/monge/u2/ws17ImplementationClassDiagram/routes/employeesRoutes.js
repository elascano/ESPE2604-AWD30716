const express = require("express");
const Song = require("../models/song");

const router = express.Router();

// Create a new song
router.post("/songs", async (req, res) => {
  try {
    const song = new Song(req.body);
    const newSong = await song.save();
    res.status(201).json(newSong);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all songs
router.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a song by id
router.get("/songs/:id", async (req, res) => {
  try {
    const song = await Song.findOne({ id: req.params.id });
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
