const port = 3004;
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0"
);

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () =>
  console.log("Cardenas System connected to MongoDB Database")
);

app.use(express.json());
app.use(express.static("./views"));

const customerRouter = require("./routes/customerRoutes");
app.use("/computerstore", customerRouter);

app.listen(port, () => {
  console.log(`Andres's Computers Store Server is running on port ${port}`);
});