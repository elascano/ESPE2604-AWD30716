const express = require("express");
const router = express.Router();
const notebookController = require("../controllers/insectController");


router.get("/notebook", (req, res) => notebookController.getAll(req, res));


router.get("/notebook/size", (req, res) => notebookController.getBySize(req, res));



router.delete("/notebook/size/:sizeType", (req, res) => notebookController.deleteByCategory(req, res));


router.delete("/notebook/:id", (req, res) => notebookController.deleteById(req, res));

module.exports = router;

