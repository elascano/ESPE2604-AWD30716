const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const port = process.env.PORT || 3014;
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("Error: MONGODB_URI is not defined in environment variables.");
  process.exit(1);
}
mongoose.connect(mongoUri);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Rodriguez System connected to mongoDB"));

app.use(express.json());
const customerRoutes = require("./routes/customerRoutes");
app.use("/computerstore", customerRoutes);
app.use(express.static("public"));

app.listen(port, () =>
  console.log("David's Computers Store server is running on port-->" + port),
);
