const express = require("express");
const cors = require("cors");
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = 4002;

app.use(cors());
app.use(express.json());
app.use("/computerstore", postRoutes);

app.listen(PORT);
