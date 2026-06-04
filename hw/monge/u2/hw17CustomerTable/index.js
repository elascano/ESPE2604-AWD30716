// Ricardo's port 3011
const dns = require('dns');
// Esto usa los servidores DNS de Google para evitar problemas de resolución de SRV con MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

const port = 3011;
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0`);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Ricardo system connected to MongoDB Database"));
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files like index.html
const customerRouter = require("./routes/customerRoutes");
app.use("/computerstore", customerRouter);
app.listen(port, () => console.log("Ricardo´s Computer Store Server is running on port -->" + port));