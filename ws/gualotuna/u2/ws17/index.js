const express = require("express");
const app = express();
const mongoose = require("mongoose");

const port = process.env.PORT || 3009;
const mongoUri = process.env.MONGODB_URI || "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

mongoose.connect(mongoUri);

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Gualotuna's System connnected to MongoDB Database"));

app.use(express.json());

const gameRouter = require("./routes/gameRoutes");

app.use("/gamesworld", gameRouter);

app.listen(port, () => console.log("Brayan's Games World Server is Running on port ---> " + port));
