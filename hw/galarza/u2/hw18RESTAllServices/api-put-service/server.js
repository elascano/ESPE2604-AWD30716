const express = require("express");
const cors = require("cors");
const putRoutes = require("./routes/putRoutes");

const app = express();
const PORT = 4003;

app.use(cors());
app.use(express.json());
app.use("/computerstore", putRoutes);

app.listen(PORT);
