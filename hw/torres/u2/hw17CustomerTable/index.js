try {
  require("dotenv").config();
} catch {
  // dotenv is optional for classroom demos; environment variables still work.
}

const path = require("node:path");
const express = require("express");
const mongoose = require("mongoose");
const customerRouter = require("./routes/customerRoutes");

const app = express();
const port = process.env.PORT || 3017;
const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/customerStore", customerRouter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "HW17 Customer Table",
    author: "Carlos Alexander Torres Pincay"
  });
});

mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 8000 })
  .then(() => {
    console.log("Alexander Torres customer table connected to MongoDB");
    startServer();
  })
  .catch((error) => {
    console.warn("MongoDB connection unavailable. Running with demo customer data:", error.message);
    startServer();
  });

function startServer() {
  app.listen(port, () => {
    console.log(`Customer Table server running on http://localhost:${port}`);
  });
}
