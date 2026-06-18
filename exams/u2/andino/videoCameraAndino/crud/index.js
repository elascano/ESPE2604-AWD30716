// David's port 3000
const port = 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://admin:admin@awd.ypmipjt.mongodb.net/digitalStore?appName=AWD`);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("David system connected to MongoDB Database"));
app.use(express.json());
const videoCameraRouter = require("./routes/videoCameraRoutes");
app.use("/digitalStore", videoCameraRouter);
app.listen(port, () => console.log("David´s video Camera Server is running on port -->" + port));