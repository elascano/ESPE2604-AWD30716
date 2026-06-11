const port = 3005;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();


const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
	throw new Error('MONGO_URI no está definida en el entorno');
}

mongoose.connect(mongoURI);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Kerly System connected to mongoDB"));

app.use(express.json());

const medicineRoutes = require("./routes/medicineRoutes");
app.use("/medicines", medicineRoutes);

app.listen(port, () => console.log("Kerly's System server is running on port--> " + port));