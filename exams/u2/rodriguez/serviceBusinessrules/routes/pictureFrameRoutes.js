const express = require("express");
const controller = require("../controllers/pictureFrameController");
const router = express.Router();

router.get("/pictureFrame", (req, res) => controller.getAll(req, res));
router.get("/pictureFrame/:id", (req, res) => controller.findById(req, res));
router.post("/pictureFrame", (req, res) => controller.create(req, res));
router.put("/pictureFrame/:id", (req, res) => controller.update(req, res));
router.delete("/pictureFrame/:id", (req, res) => controller.delete(req, res));

module.exports = router;
