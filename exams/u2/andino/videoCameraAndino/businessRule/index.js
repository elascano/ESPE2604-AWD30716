// David's port 3002
const port = 3002;
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());
const customerRouter = require("./routes/videoCameraRoutes");
app.use("/computerstore", customerRouter);
app.listen(port, () => console.log("David´s Computer Store Server is running on port -->" + port));