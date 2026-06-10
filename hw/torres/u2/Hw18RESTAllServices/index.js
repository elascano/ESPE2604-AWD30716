const path = require("node:path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const customerRouter = require("./routes/customerRoutes");

try {
  require("dotenv").config();
} catch {
  // dotenv is optional; AWS/PM2 environment variables still work without it.
}

const app = express();
const port = process.env.PORT || 3016;
const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/computerstore", customerRouter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Hw18RESTAllServices",
    author: "Carlos Alexander Torres Pincay",
    database: mongoose.connection.readyState === 1 ? "connected" : "demo"
  });
});

mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 8000 })
  .then(() => {
    console.log("Hw18RESTAllServices connected to the class MongoDB database");
    startServer();
  })
  .catch((error) => {
    console.warn("MongoDB is unavailable. Running with in-memory demo data:", error.message);
    startServer();
  });

function startServer() {
  app.listen(port, () => {
    console.log(`Hw18RESTAllServices running on http://localhost:${port}`);
  });
}
