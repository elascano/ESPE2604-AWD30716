const express = require("express");
const router = express.Router();

const publicCrudIP = "136.116.13.122";
const baseURI = `http://${publicCrudIP}:3004/andresflashdrivebusiness`;

router.get("/flashes/totalPrice", async (request, response) => {
    try {
        const flashesRecords = await fetch(`${baseURI}/flashes`);
        if (!flashesRecords) {
            return response.status(404).json({ status: 404, error: "Keyboards not found" });
        }
        const flashes = await flashesRecords.json();
        let totalPrice = 0;
        flashes.forEach(flash => {
            totalPrice = totalPrice + flash.price;
        });
        response.json({ totalPrice : totalPrice});

    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.get("/flashes/IVA", async (request, response) => {
    try {
        const flashRecord = await fetch(`${baseURI}/flashes/${request.params.name}`);
        if (!flashRecord) {
            return response.status(404).json({ status: 404, error: "Flash not found" });
        }
        const flash = await flashRecord.json();
        let iva = flash.price * 0.12;
        response.json({ iva : iva});

    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.get("/flashes/leftDays", async (request, response) => {
    try {
        const flashRecord = await fetch(`${baseURI}/flashes/${request.params.name}`);
        if (!flashRecord) {
            return response.status(404).json({ status: 404, error: "Flash not found" });
        }
        const flash = await flashRecord.json();
        const todayDate = new Date();
        const flashExpirationDate = new Date(flash.expiration_date);
        let leftDays = todayDate.getFullDay() - flashExpirationDate.getFullDay();

        response.json({leftDays : leftDays});
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

module.exports = router;