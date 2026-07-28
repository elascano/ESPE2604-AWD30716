const express = require("express");

const router = express.Router();

const controller = require("../controllers/products.controller");

router.post("/bulk", controller.addProductsBulk);

router.post("/", controller.addProduct);

router.get("/", controller.getProducts);

router.get("/total", controller.getTotal);

router.get("/:id/iva", controller.getIVA);

router.get("/:id/expiration", controller.getExpiration);

module.exports = router;
