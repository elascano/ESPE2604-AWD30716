const express = require("express");
const Videogame = require("../models/videogame");
const router = express.Router();

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