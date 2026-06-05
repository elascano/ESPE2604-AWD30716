const port = 3007;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const customerRoutes = require('./routes/customerRoutes');

mongoose.connect("mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0")

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Isaac's system connected to MongoDB"));


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));


app.use("/computerstore", customerRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Isaac's Computer Store server is running on port ${port}`);
});

