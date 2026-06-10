require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const customerRouter = require("./routes/customerRoutes");

const app = express();
const port = process.env.PORT || 3016;
const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "Alexander Torres Computer Store API",
    endpoints: ["/computerstore/customers", "/computerstore/customer/:id"]
  });
});

app.use("/computerstore", customerRouter);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Alexander Torres system connected to MongoDB");
    app.listen(port, () => {
      console.log(`Computer Store REST server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
