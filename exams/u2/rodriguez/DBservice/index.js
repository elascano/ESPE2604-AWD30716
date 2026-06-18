const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const PictureFrame = require("./models/pictureFrame");

class DatabaseController {
  async getAll(req, res) {
    try {
      const items = await PictureFrame.find();
      res.json(items.map(item => item.toObject()));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req, res) {
    try {
      const idParam = req.params.id;
      let item;
      if (!isNaN(idParam)) {
        item = await PictureFrame.findOne({ id: Number(idParam) });
      } else {
        item = await PictureFrame.findById(idParam);
      }
      if (!item) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json(item.toObject());
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async create(req, res) {
    try {
      let nextId = req.body.id;
      if (nextId === undefined || nextId === null) {
        const lastItem = await PictureFrame.findOne().sort({ id: -1 });
        nextId = lastItem && lastItem.id ? lastItem.id + 1 : 1;
      }
      const itemData = { ...req.body, id: nextId };
      const item = new PictureFrame(itemData);
      const newItem = await item.save();
      res.status(201).json(newItem.toObject());
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const idParam = req.params.id;
      let item;
      if (!isNaN(idParam)) {
        item = await PictureFrame.findOne({ id: Number(idParam) });
      } else {
        item = await PictureFrame.findById(idParam);
      }
      if (!item) {
        return res.status(404).json({ message: "Not found" });
      }
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem.toObject());
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const idParam = req.params.id;
      let deletedItem;
      if (!isNaN(idParam)) {
        deletedItem = await PictureFrame.findOneAndDelete({ id: Number(idParam) });
      } else {
        deletedItem = await PictureFrame.findByIdAndDelete(idParam);
      }
      if (!deletedItem) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

class DatabaseServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3016;
    this.controller = new DatabaseController();
  }

  async connectDb() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    try {
      const count = await PictureFrame.countDocuments();
      if (count === 0) {
        const dataPath = path.join(__dirname, "data", "initialData.json");
        const fileData = fs.readFileSync(dataPath, "utf8");
        const initialData = JSON.parse(fileData);
        for (const item of initialData) {
          const doc = new PictureFrame(item);
          await doc.save();
        }
        console.log("Database seeded successfully");
      }
    } catch (err) {
      console.error("Error seeding database:", err);
    }
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  setupRoutes() {
    this.app.get("/db/pictureFrame", (req, res) => this.controller.getAll(req, res));
    this.app.get("/db/pictureFrame/:id", (req, res) => this.controller.getById(req, res));
    this.app.post("/db/pictureFrame", (req, res) => this.controller.create(req, res));
    this.app.put("/db/pictureFrame/:id", (req, res) => this.controller.update(req, res));
    this.app.delete("/db/pictureFrame/:id", (req, res) => this.controller.delete(req, res));
    this.app.get("/", (req, res) => res.json({ message: "Database service running" }));
  }

  async start() {
    await this.connectDb();
    this.setupMiddleware();
    this.setupRoutes();
    this.app.listen(this.port, () => {
      console.log(`Database service running on port ${this.port}`);
    });
  }
}

new DatabaseServer().start().catch(err => {
  console.error("Server startup error:", err);
});
