const port = 3014;
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://oop:oop@cluster0-shard-00-00.9knxc.mongodb.net:27017,cluster0-shard-00-01.9knxc.mongodb.net:27017,cluster0-shard-00-02.9knxc.mongodb.net:27017/oop?ssl=true&replicaSet=atlas-k7765w-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0",
);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("David's system connected to MongoDB"));

app.use(express.json());

const customerRoutes = require("./routes/customerRoutes");

app.use("/computerstore", customerRoutes);

app.listen(port, () => {
  console.log(`David's Computer Store server is running on port ${port}`);
});
