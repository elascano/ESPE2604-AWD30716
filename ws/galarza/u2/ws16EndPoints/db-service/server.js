require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Watch = require("./models/Watch");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("¡Conectado exitosamente a MongoDB Atlas!"))
    .catch(err => console.error("Error al conectar a MongoDB:", err));

app.get("/db/watches", async (req, res) => {
    try {
        const data = await Watch.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/db/watches/:id", async (req, res) => {
    try {
        const data = await Watch.findOne({ id: req.params.id });
        if (!data) return res.status(404).json({ error: "Watch not found" });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/db/watches", async (req, res) => {
    try {
        const newWatch = new Watch(req.body);
        const savedWatch = await newWatch.save();
        res.status(201).json(savedWatch);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put("/db/watches/:id", async (req, res) => {
    try {
        const updatedWatch = await Watch.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedWatch) return res.status(404).json({ error: "Watch not found" });
        res.json(updatedWatch);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete("/db/watches/:id", async (req, res) => {
    try {
        const deletedWatch = await Watch.findOneAndDelete({ id: req.params.id });
        if (!deletedWatch) return res.status(404).json({ error: "Watch not found" });
        res.json({ message: "Watch deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server start at port: ${PORT}`);
});