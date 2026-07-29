const express = require("express");
const router = express.Router();

const publicCrudIP = "localhost";
const baseURI = `http://${publicCrudIP}:3000/andresflashdrivebusiness`;

function calculateDaysLeft(expirationDateValue) {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const expirationDate = new Date(expirationDateValue);
    expirationDate.setHours(0, 0, 0, 0);
    const differenceInMilliseconds = expirationDate.getTime() - todayDate.getTime();
    return Math.ceil(differenceInMilliseconds / (1000 * 3600 * 24));
}

function calculateIva(priceValue) {
    return Number((priceValue * 0.12).toFixed(2));
}

router.get("/flashes", async (request, response) => {
    try {
        const flashesRecordsResponse = await fetch(`${baseURI}/flashes`);
        if (!flashesRecordsResponse.ok) {
            return response.status(flashesRecordsResponse.status).json({ error: "Failed to fetch from CRUD database" });
        }
        const flashesList = await flashesRecordsResponse.json();
        
        const enrichedFlashesList = flashesList.map(flashItem => {
            return {
                ...flashItem,
                iva: calculateIva(flashItem.price || 0),
                leftDays: calculateDaysLeft(flashItem.expiration_date)
            };
        });
        response.json(enrichedFlashesList);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.post("/flashes", async (request, response) => {
    try {
        const { name, price, day, month, year } = request.body;
        const expirationDate = new Date(Number(year), Number(month) - 1, Number(day));
        
        const mappedPayload = {
            name: name,
            price: Number(price),
            expiration_date: expirationDate
        };

        const createProductResponse = await fetch(`${baseURI}/flashes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mappedPayload)
        });
        if (!createProductResponse.ok) {
            const errorDetails = await createProductResponse.json().catch(() => ({}));
            return response.status(createProductResponse.status).json(errorDetails);
        }
        const savedProductRecord = await createProductResponse.json();
        response.status(201).json(savedProductRecord);
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.post("/flashes/cart/total", (request, response) => {
    try {
        const cartProductsList = request.body.items;
        if (!Array.isArray(cartProductsList)) {
            return response.status(400).json({ error: "Items must be an array" });
        }
        let totalCalculatedPrice = 0;
        cartProductsList.forEach(productItem => {
            totalCalculatedPrice += Number(productItem.price || 0);
        });
        response.json({ totalPrice: Number(totalCalculatedPrice.toFixed(2)) });
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.get("/flashes/totalPrice", async (request, response) => {
    try {
        const flashesRecordsResponse = await fetch(`${baseURI}/flashes`);
        if (!flashesRecordsResponse.ok) {
            return response.status(flashesRecordsResponse.status).json({ error: "Products not found" });
        }
        const flashesList = await flashesRecordsResponse.json();
        let totalCalculatedPrice = 0;
        flashesList.forEach(flashItem => {
            totalCalculatedPrice = totalCalculatedPrice + (flashItem.price || 0);
        });
        response.json({ totalPrice: Number(totalCalculatedPrice.toFixed(2)) });
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.get("/flashes/IVA/:name", async (request, response) => {
    try {
        const flashRecordResponse = await fetch(`${baseURI}/flashes/${request.params.name}`);
        if (!flashRecordResponse.ok) {
            return response.status(404).json({ error: "Product not found" });
        }
        const flashItem = await flashRecordResponse.json();
        let computedIvaAmount = calculateIva(flashItem.price || 0);
        response.json({ iva: computedIvaAmount });
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

router.get("/flashes/leftDays/:name", async (request, response) => {
    try {
        let expirationDateObject;
        const { day, month, year } = request.query;

        if (day && month && year) {
            expirationDateObject = new Date(Number(year), Number(month) - 1, Number(day));
        } else {
            const flashRecordResponse = await fetch(`${baseURI}/flashes/${request.params.name}`);
            if (!flashRecordResponse.ok) {
                return response.status(404).json({ error: "Product not found" });
            }
            const flashItem = await flashRecordResponse.json();
            expirationDateObject = new Date(flashItem.expiration_date);
        }

        const computedLeftDays = calculateDaysLeft(expirationDateObject);
        response.json({ leftDays: computedLeftDays });
    } catch (error) {
        response.status(500).json({ errorMessage: error.message });
    }
});

module.exports = router;