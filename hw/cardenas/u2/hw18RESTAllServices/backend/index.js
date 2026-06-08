const port = 3000;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const customerRouter = require("./routes/customerRoutes");

const app = express();

mongoose.connect(
    "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?retryWrites=true&w=majority&appName=Cluster0"
);

const databaseConnection = mongoose.connection;

databaseConnection.on("error", (error) => console.error(error));
databaseConnection.once("open", () =>
    console.log("Database connection established successfully")
);

app.use(cors());
app.use(express.json());

app.use("/computerstore", customerRouter);

app.listen(port, () => {
    console.log(`Backend's server is running on port ${port}`);
});