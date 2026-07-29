const port = 3000;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const flashdriveRouter = require("./routes/flashdriveRoutes");

const app = express();

mongoose.connect(
    "mongodb://admin:admin@ac-fitnoz1-shard-00-00.x7strgx.mongodb.net:27017,ac-fitnoz1-shard-00-01.x7strgx.mongodb.net:27017,ac-fitnoz1-shard-00-02.x7strgx.mongodb.net:27017/FlashDriveDB?ssl=true&replicaSet=atlas-23espr-shard-0&authSource=admin&retryWrites=true&w=majority"
);

const databaseConnection = mongoose.connection;

databaseConnection.on("error", (error) => console.error(error));
databaseConnection.once("open", () =>
    console.log("Database connection established successfully")
);

app.use(cors());
app.use(express.json());

app.use("/andresflashdrivebusiness", flashdriveRouter);

app.listen(port, () => {
    console.log(`Backend's server is running on port ${port}`);
});