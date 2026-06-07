const port = process.env.PORT || 3006
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0');
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Diaz System connected to mongoDB"));

app.use(express.json());

const cors = require('cors');
app.use(cors());

const customerRoutes = require("./routes/customerRoutes");
app.use("/computerstore", customerRoutes);

// Root endpoint serving JSON metadata
app.get("/", (req, res) => {
  res.json({
    status: "online",
    name: "Diaz's Computers Store API Server",
    version: "1.0.0",
    endpoints: {
      customers: "/computerstore/customers",
      total: "/computerstore/customers/total",
      customerDetails: "/computerstore/customers/:id"
    }
  });
});

app.listen(port, () => console.log("Diaz's Computers Store server is running on port-->" + port));