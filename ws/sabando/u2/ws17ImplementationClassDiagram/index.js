require("dotenv").config();

const port = process.env.PORT || 3015;
const express = require("express");
const app = express();

app.use(express.json());

const animalRouter = require("./routes/animalRoutes");

// Monta las rutas de animales bajo el prefijo /api
app.use("/api", animalRouter);

app.listen(port, () => {
    console.log(`El servidor de gestion de animales esta corriendo en el puerto --> ${port}`);
});