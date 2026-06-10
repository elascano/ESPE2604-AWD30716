// Jilmar Calderon
const port = process.env.PORT || 3003; 
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname))); 

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Calderon System connected to MongoDb Database"));

const customerRouter = require("./routes/customerRoutes");
app.use("/computerstore", customerRouter);

app.listen(port, () => console.log("Calderon Computers Store Server is running on port --> " + port));