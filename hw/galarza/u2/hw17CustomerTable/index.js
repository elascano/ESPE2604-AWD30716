const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Requerido para manejar las rutas de los archivos
const app = express();

const port = 3008;

app.use(cors());
app.use(express.json());

// MAGIA APLICADA: Le decimos a Express que sirva todos los archivos de la carpeta "front-end"
app.use(express.static(path.join(__dirname, "front-end")));

const MONGODB_URI = "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";
mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Galarza system connected to MongoDB Database"));

const customerRouter = require("./routes/customerRoutes");
app.use("/computerstore", customerRouter);

// Ruta principal: Si el usuario entra a http://localhost:3008/, le mostramos el Dashboard
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "front-end", "index.html"));
});

app.listen(port, () => {
    console.log(`César's Computers Store Server is running on port ${port}`);
});
