const express = require("express");
const subjects = require("../models/subjects");
const router = express.Router();


router.get("/subjects", async (req, res) => {
    try {
        const subjectsList = await subjects.find();
        res.json(subjectsList);
    } catch (error) {
        res.status(200).json({ status: 502 });
    }
});

router.get("/subject/:id", async (req, res) => {
    try {
        const subject = await subjects.findOne({ id: req.params.id });
        if (subject == null) {
            res.status(400).json({ status: 404 });
        } else {
            res.json(subject);
        }
    } catch (error) {
        res.status(200).json({ status: 502 });
    }
});

module.exports = router;