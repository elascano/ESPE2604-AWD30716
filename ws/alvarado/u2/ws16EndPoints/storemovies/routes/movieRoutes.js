const express = require("express");
const Movie   = require("../models/movie");
const router  = express.Router();

function hasRequiredFields(doc) {
  return (
    doc.id       != null &&
    doc.director != null &&
    doc.gender   != null &&
    doc.title    != null
  );
}

function formatMovie(doc, index) {
  return {
    number:   index + 1,
    _id:      doc._id,
    id:       doc.id,
    director: doc.director,
    gender:   doc.gender,
    title:    doc.title,
  };
}

// GET /storemovies/movies  — list all movies
router.get("/movies", async (req, res) => {
  try {
    const raw    = await Movie.find().lean();
    const valid  = raw.filter(hasRequiredFields);
    const movies = valid.map((doc, i) => formatMovie(doc, i));
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /storemovies/movies  — insert a new movie
router.post("/movies", async (req, res) => {
  const { id, director, gender, title } = req.body;

  if (id == null || director == null || gender == null || title == null) {
    return res.status(400).json({
      status:  400,
      message: "Missing required fields: id, director, gender and title are mandatory",
    });
  }

  try {
    const exists = await Movie.findOne({ id }).lean();
    if (exists) {
      return res.status(409).json({
        status:  409,
        message: "A movie with that id already exists",
      });
    }

    const movie = new Movie({ id, director, gender, title, ...req.body });
    const saved = await movie.save();
    res.status(201).json(formatMovie(saved.toObject(), 0));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
