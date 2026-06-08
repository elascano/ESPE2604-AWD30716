const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const customerRoutes = require("./routes/customerRoutes");

const app = express();
const port = process.env.PORT || 3007;
const mongoUri = process.env.MONGODB_URI || "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

mongoose
  .connect(mongoUri)
  .then(() => console.log("Erazo customer service connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use("/computerstore", customerRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    service: "Erazo Customer REST Services",
    methods: ["GET", "POST", "PUT", "DELETE"]
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Erazo customer service is running on port ${port}`);
});
