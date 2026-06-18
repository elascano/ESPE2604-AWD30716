const port = 3004;
const express = require("express");
const cors = require("cors");
const keyboardRouter = require("./routes/keyboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/andreskeyboardstore", keyboardRouter);

app.listen(port, () => {
    console.log(`Backend's server is running on port ${port}`);
});