const express = require("express");
const cors = require("cors");
const getRoutes = require("./routes/getRoutes");

const app = express();
const PORT = 4001;

app.use(cors());
app.use(express.json());
app.use("/computerstore", getRoutes);

app.listen(PORT);
