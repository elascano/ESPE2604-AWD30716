const port = 3005;
const express = require('express');
const app = express();
const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://kachuqui_db_user:Simon123@cluster0.x7strgx.mongodb.net/?appName=Cluster0");
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Kerly System connected to mongoDB"));


app.use(express.json());

const medicineRoutes = require("./routes/medicineRoutes");

app.use("/medicines", medicineRoutes);

app.listen(port, () => console.log("Kerly's System server is running on port--> " + port));