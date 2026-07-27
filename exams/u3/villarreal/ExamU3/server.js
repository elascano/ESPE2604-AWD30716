const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const port = process.env.PORT || 8080;
const app = express();

mongoose.connect(
  "mongodb+srv://Evelyn:899105@cluster0.dfjbhqc.mongodb.net/Mask?appName=Cluster0"
);

const dbConnection = mongoose.connection;
dbConnection.on("error", (error) => console.error(error));
dbConnection.once("open", () =>
  console.log("Database connection established successfully")
);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

const logicRoutes = require('./businessLogic/routes/logicRoutes');
app.use('/api/masks', logicRoutes);

const maskRoutes = require('./crud/routes/maskRoutes');
app.use('/api/masks', maskRoutes);

app.listen(port, () => {
  console.log(`Unified Server running on port ${port}`);
});
