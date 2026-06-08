const port = process.env.PORT || 3017;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0"
);

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () =>
  console.log("Villarreal System connected to MongoDB Database")
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const customerRouter = require("./routes/customerRoutes");
app.use("/computerstore", customerRouter);

app.listen(port, () => {
  console.log(`Evelyn's Computers Store Server is running on port ${port}`);
});
