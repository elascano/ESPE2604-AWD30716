const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 3002;
const mongoURI = process.env.MONGO_URI || "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("David system connected to MongoDB Database"));

app.use(express.json());
app.use(cors());

const customerRouter = require("./routes/customerRoutes");
app.use("/computerstore", customerRouter);

app.listen(port, () => console.log("David´s Computer Store Server is running on port --> " + port));