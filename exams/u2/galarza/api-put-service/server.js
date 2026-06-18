require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const putRoutes = require("./routes/putRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", putRoutes);

app.listen(process.env.PORT_PUT, () => {
    console.log(`[SUCCESS] ${process.env.APP_NAME} API PUT Service is up and running for ${process.env.ITEM_PLURAL} on port ${process.env.PORT_PUT}`);
});
