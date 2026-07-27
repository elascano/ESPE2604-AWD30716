const port = process.env.PORT || 4017;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const logicRoutes = require("./routes/logicRoutes");

const app = express();

mongoose.connect(
  "mongodb+srv://Evelyn:899105@cluster0.dfjbhqc.mongodb.net/Mask?appName=Cluster0"
);

const dbConnection = mongoose.connection;

dbConnection.on("error", (error) => console.error(error));
dbConnection.once("open", () =>
  console.log("Database connection established successfully")
);

app.use(cors());
app.use(express.json());

app.use("/api/masks", logicRoutes);

app.listen(port, () => {
  console.log(`Business logic server running on port ${port}`);
});
