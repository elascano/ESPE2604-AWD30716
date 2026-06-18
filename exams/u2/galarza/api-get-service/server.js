require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const getRoutes = require("./routes/getRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", getRoutes);

app.listen(process.env.PORT_GET, () => {
    console.log(`[SUCCESS] ${process.env.APP_NAME} API GET Service is up and running for ${process.env.ITEM_PLURAL} on port ${process.env.PORT_GET}`);
});
