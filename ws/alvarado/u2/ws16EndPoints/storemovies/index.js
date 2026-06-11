const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URI = "mongodb+srv://<user>:<password>@cluster0.cd2ybxo.mongodb.net/storemovies?";

mongoose.connect(MONGO_URI);

const db = mongoose.connection;
db.on("error",  (error) => console.error("MongoDB error:", error));
db.once("open", ()      => console.log("Connected to MongoDB Database"));

const movieRouter = require("./routes/movieRoutes");
app.use("/storemovies", movieRouter);

app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, "0.0.0.0", () =>
  console.log(`Store Movies running on port ${port}`)
);
