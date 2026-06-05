const port = 3005;
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0");
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Kerly System connected to mongoDB"));

app.use(express.json());
const customerRoutes = require("./routes/customerRoutes");
app.use("/computerstore", customerRoutes);

app.listen(port, () => console.log("Kerly's Computers Store server is running on port-->" + port));