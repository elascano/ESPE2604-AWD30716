require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", postRoutes);

app.listen(process.env.PORT_POST, () => {
    console.log(`[SUCCESS] ${process.env.APP_NAME} API POST Service is up and running for ${process.env.ITEM_PLURAL} on port ${process.env.PORT_POST}`);
});
