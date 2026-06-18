const express = require("express");
const router = express.Router();
const compactDiscController = require("../controllers/compactDiscController");

router.delete("/timemachine/compactdisc", compactDiscController.deleteCompactDisc);

module.exports = router;
