const port = 3002;
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://admin:admin@awd.ypmipjt.mongodb.net/University`);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("David system connected to MongoDB Database"));
app.use(express.json());
const subjectsRouter = require("./routes/subjectRoutes");
app.use("/University", subjectsRouter);
app.listen(port, () => console.log("David´s Computer Store Server is running on port -->" + port));