const express = require("express");
const router = express.Router();

const publicCrudIP = "localhost";
const baseURI = `http://${publicCrudIP}:3000/flashdrivebusiness`;

router.get("/flashes/obsolete", async (request, response) => {
    try {
        const elaborationDate = new Date(request.elaborationDate);
        const actualYear = new Date();
        const flashDriveExpirationYear = elaborationDate.getFullYear() + request.lifeYears;
        let isObsolete = flashDriveExpirationYear > actualYear.getFullYear();

        if(!isObsolete) {
            response.json({ message : "Flash is OK" });
            return;
        };

        const deletedFlash = await fetch(`${baseURI}/flashes/${id}`, {
        method: 'DELETE'
        });

        response.json({ message : "Flash is obsolete and has been deleted." });

    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});


module.exports = router;
