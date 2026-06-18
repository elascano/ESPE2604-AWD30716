const express = require("express");
const keyboard = require("../../crud/models/keyboard");
const router = express.Router();

const publicCrudIP = "35.238.2.136";
const baseURI = `http://${publicCrudIP}:3000/andreskeyboardstore`;

router.get("/keyboards/warrantyMonthsAverage", async (request, response) => {
    try {
        const keyboardRecords = await fetch(`${baseURI}/keyboards`);
        if (!keyboardRecords) {
            return response.status(404).json({ status: 404, error: "Keyboards not found" });
        }
        const keyboards = await keyboardRecords.json();
        let warrantyMonthsAverage = 0;
         keyboards.forEach(keyboard => {
            warrantyMonthsAverage = warrantyMonthsAverage + keyboard.warranty_months;
         });
        warrantyMonthsAverage = Math.round(warrantyMonthsAverage/keyboards.length, 2);
        response.json({ warrantyMonthsAverage : warrantyMonthsAverage});

    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.get("/keyboards/ages", async (request, response) => {
    try {
        const keyboardRecords = await fetch(`${baseURI}/keyboards`);
        if (!keyboardRecords) {
            return response.status(404).json({ status: 404, error: "Keyboard not found" });
        } 
        let keyboards = await keyboardRecords.json();
        const todayDate = new Date();
        keyboards.forEach(keyboard => {
            const keyboardDate = new Date(keyboard.release_date);
            keyboard.age = todayDate.getFullYear() - keyboardDate.getFullYear();
        });

        response.json(keyboards);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

module.exports = router;
