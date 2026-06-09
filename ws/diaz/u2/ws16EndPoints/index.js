const port = 5006
const express = require('express');
const app = express();
const mongoose = require('mongoose');

//mongoose.connect('mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0');
mongoose.connect('mongodb+srv://cvdiaz3_db_user:admin123@cluster0.vigvruj.mongodb.net/library?retryWrites=true&w=majority&appName=Cluster0');
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Diaz System connected to mongoDB"));

app.use(express.json());
const bookRoutes = require("./routes/booksRoutes");
app.use("/library", bookRoutes);

app.listen(port, () => console.log("Diaz's Library server is running on port-->" + port));