const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const port = 3015;
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0`)

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Lascano System connected to mongodb database"))

app.use(express.json());
app.use(express.static(__dirname));

const customerRouter = require("./routes/customerRoutes");

app.use("/computerstore", customerRouter);

app.listen(port, () => console.log("Edison  computers store server is running on port --> "+port));