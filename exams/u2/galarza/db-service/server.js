require("dotenv").config({ path: "../.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dbRoutes = require("./routes/dbRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.APP_NAME
});

app.use("/db", dbRoutes);

app.listen(process.env.PORT_DB, () => {
    console.log(`[SUCCESS] MongoDB Connection established. Database Service running on port ${process.env.PORT_DB}`);
});
