const express = require("express");
const router = express.Router();

const publicCrudIP = "35.238.2.136";
const baseURI = `http://${publicCrudIP}:3000/andresflashdrivebusiness`;

router.get("/flashes/obsolete", async (request, response) => {
    try {
        const elaborationDate = new Date(request.body.elaborationDate);
        const actualYear = new Date();
        const flashDriveExpirationYear = elaborationDate.getFullYear() + Number(request.body.lifeYears);
        let isObsolete = flashDriveExpirationYear <= actualYear.getFullYear();

        if(!isObsolete) {
            response.json({ message : "Flash is OK" });
            return;
        }

        await fetch(`${baseURI}/flashes/${request.body.id}`, {
            method: 'DELETE'
        });

        response.json({ message : "Flash is obsolete and has been deleted." });

    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

module.exports = router;