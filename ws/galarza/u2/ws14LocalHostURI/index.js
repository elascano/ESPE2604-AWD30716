//César's port 3008
const port = 3008
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0`);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Galarza system connected to MongoDB Database"));
app.use(express.json());

const customerRouter = require("./routes/customerRoutes");
app.use("/computerstore", customerRouter);
app.listen(port, () =>
    console.log("César's Computers Store Server is running on port --> " + port)
);