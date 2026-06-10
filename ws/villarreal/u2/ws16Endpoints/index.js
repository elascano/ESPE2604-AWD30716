const port = process.env.PORT || 3017;
const express = require("express");
const mongoose = require("mongoose");

const app = express();
//SongsRepository
//scream it out loud
mongoose.connect(
  process.env.MONGODB_URI || "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0"
);

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to MongoDB Database"));

app.use(express.json());

const songRoutes = require("./routes/songRoutes");
app.use("/songsrepository", songRoutes);

app.listen(port, () => {
  console.log(`Songs Repository Server is running on port ${port}`);
});
