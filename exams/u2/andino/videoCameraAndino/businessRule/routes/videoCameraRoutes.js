const express = require("express");
const videoCamera = require("../models/videoCamera");
const router = express.Router();

router.get("/videoCamera", async(req, res) =>{
    try {
        const response = await fetch("http://18.216.188.194:3000/digitalStore/videoCamera");
        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }
        const videoCameras = await response.json();

        const modifiedCameras = videoCameras.map(camera => {
            let quality = "Standard";
            const size = parseInt(camera.lensSize, 10);
            
            if (size >= 50) {
                quality = "4K (High)";
            } else if (size >= 30) {
                quality = "1080p (Medium)";
            } else if (size > 0) {
                quality = "720p (Low)";
            }

            return {
                ...camera,
                resolutionQuality: quality
            };
        });

        res.json(modifiedCameras);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
