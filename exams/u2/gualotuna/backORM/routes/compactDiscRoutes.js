const express = require("express");
const router = express.Router();
const compactDiscController = require("../controllers/compactDiscController");

router.get("/compactdisc/:serial", compactDiscController.getCompactDiscBySerial);
router.delete("/compactdisc/:serial", compactDiscController.deleteCompactDiscBySerial);

module.exports = router;
