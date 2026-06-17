const express = require("express");
const FlashDrive = require("../models/flashdrive");
const router = express.Router();

router.delete("/flashes/:id", async (request, response) => {
    try {
        const deletedFlashDrive = await FlashDrive.findOneAndDelete({ id: request.params.id });
        if (!deletedFlashDrive) {
            return response.status(404).json({ status: 404, error: "FlashDrive not found to delete" });
        }
        response.json({ status: 200, message: "Flash drive deleted" });
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

module.exports = router;