const port = 3004;
const express = require("express");
const cors = require("cors");
const flashdriveRouter = require("./routes/flashdriveRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/andresflashdrivebusiness", flashdriveRouter);

app.listen(port, () => {
    console.log(`Backend's server is running on port ${port}`);
});