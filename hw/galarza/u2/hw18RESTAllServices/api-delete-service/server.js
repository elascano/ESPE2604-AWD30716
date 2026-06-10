const express = require("express");
const cors = require("cors");
const deleteRoutes = require("./routes/deleteRoutes");

const app = express();
const PORT = 4004;

app.use(cors());
app.use(express.json());
app.use("/computerstore", deleteRoutes);

app.listen(PORT);
