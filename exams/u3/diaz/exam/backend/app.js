const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Ensures a MongoDB connection exists before handling any /api request
// (needed because Lambda reuses the connection across invocations)
app.use(async (req, res, next) => {

    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ message: "Database connection error", error: err.message });
    }

});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const productsRoutes = require("./routes/products.routes");

app.use("/api/products", productsRoutes);

module.exports = app;
