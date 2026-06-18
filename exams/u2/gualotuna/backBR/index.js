const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 4009;

app.use(cors());
app.use(express.json());

const compactDiscRouter = require("./routes/compactDiscRoutes");
app.use("/", compactDiscRouter);

app.listen(port, () => {
    console.log("Brayan's Business Rules Compact Disc Server is Running on port ---> " + port);
});
