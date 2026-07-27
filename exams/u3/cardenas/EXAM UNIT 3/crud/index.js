const port = 3004;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const flashdriveRouter = require("./routes/flashdriveRoutes");

const app = express();

mongoose.connect(
    "mongodb+srv://admin:admin@cluster0.x7strgx.mongodb.net/FlashDriveDB?appName=Cluster0"
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