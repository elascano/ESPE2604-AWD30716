require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pictureFrameRoutes = require("./routes/pictureFrameRoutes");

class BusinessServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3014;
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  setupRoutes() {
    this.app.use("/pictures-art", pictureFrameRoutes);
    this.app.get("/", (req, res) => {
      res.json({ message: "PictureFrame Business API is running" });
    });
  }

  start() {
    this.setupMiddleware();
    this.setupRoutes();
    this.app.listen(this.port, () => {
      console.log(`Business rules service running on port ${this.port}`);
    });
  }
}

new BusinessServer().start();
