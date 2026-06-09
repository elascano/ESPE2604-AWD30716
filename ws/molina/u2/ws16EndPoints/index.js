const port = 3010;
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://gagamol25:molina@clusterpractice.n0hps9y.mongodb.net/Store')

const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database successfully, Gabriel Molina'));

app.use(express.json());

const foodRouter = require('./routes/foodRoutes');
app.use('/molinastore', foodRouter);

app.listen(port, () => console.log(`Gabriel Molina's Store Server is running on port ${port}`));