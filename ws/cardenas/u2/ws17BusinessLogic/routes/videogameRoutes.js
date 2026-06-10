const express = require("express");
const Videogame = require("../models/videogame");
const router = express.Router();

router.get("/videogames/ages", async (request, response) => {
    try {
        const games = await Videogame.find({});
        const today = new Date();

        const updatedGames = games.map(game => {
            let ageInYears = null;

            if (game.launchDate) {
                const launch = new Date(game.launchDate);
                let age = today.getFullYear() - launch.getFullYear();
                const monthDiff = today.getMonth() - launch.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < launch.getDate())) {
                    age--;
                }
                ageInYears = age >= 0 ? age : 0;
            }

            return {
                ...game.toObject(),
                age: ageInYears
            };
        });

        response.json(updatedGames);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.get("/videogames/stats/average-hours", async (request, response) => {
    try {
        const stats = await Videogame.aggregate([
            {
                $group: {
                    _id: "$genre",
                    averageHours: { $avg: "$hoursGame" }
                }
            },
            {
                $project: {
                    _id: 0,
                    genre: "$_id",
                    averageHours: { $round: ["$averageHours", 1] }
                }
            },
            {
                $sort: { genre: 1 }
            }
        ]);

        response.json(stats);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.delete("/videogame/:id", async (request, response) => {
    try {
        const deletedVideogame = await Videogame.findOneAndDelete({ id: request.params.id });
        if (!deletedVideogame) {
            return response.status(404).json({ status: 404, error: "Videogame not found to delete" });
        }
        response.json({ status: 200, message: "Videogame record deleted successfully" });
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

module.exports = router;