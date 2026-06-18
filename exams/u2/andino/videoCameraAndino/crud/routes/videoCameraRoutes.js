const express = require("express");
const videoCamera = require("../models/videoCamera");
const router = express.Router();

// Get all Customers
router.get("/videoCamera", async(req, res) =>{
    try {
        const videoCameras = await videoCamera.find();
        res.json(videoCameras);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Get customer by CustomerId
router.get("/videoCamera/:id", async(req, res) =>{
    try {
        const videoCameraObject = await videoCamera.findOne({id: req.params.id});
        if(videoCameraObject == null){
            res.status(400).json({status: 404});
        } else {
            res.json(videoCameraObject);
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;