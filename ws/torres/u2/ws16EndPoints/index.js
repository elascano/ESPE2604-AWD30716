try {
  require("dotenv").config();
} catch {
  console.warn("dotenv is not installed; using default environment values.");
}

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const danceItemRoutes = require("./routes/danceItemRoutes");

const app = express();
const port = process.env.PORT || 3016;
const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const serverState = {
  databaseConnected: false,
  demoMode: false
};

app.locals.serverState = serverState;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    workshop: "ws16EndPoints",
    author: "Carlos Alexander Torres Pincay",
    database: serverState.databaseConnected ? "connected" : "not connected",
    demoMode: serverState.demoMode,
    endpoints: [
      "GET /torresstore/items",
      "GET /torresstore/item/:id",
      "GET /torresstore/items/category/:category",
      "POST /torresstore/item"
    ]
  });
});

app.use("/torresstore", danceItemRoutes);

async function startServer() {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 7000 });
    serverState.databaseConnected = true;
    console.log("Carlos Torres system connected to MongoDB");
  } catch (error) {
    serverState.demoMode = true;
    console.warn("MongoDB connection failed. Starting in demo mode:", error.message);
  }

  app.listen(port, () => {
    console.log(`Carlos Torres Dance Store endpoints running on http://localhost:${port}`);
  });
}

startServer();
