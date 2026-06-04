const port = 3000;
const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0');
console.log(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('System connected to MongoDB Database'));

app.use(express.json());

const customerRouter = require('./routes/customerRoutes');
app.use('/computerstore', customerRouter);

app.listen(port, () => console.log("Edison s Computers Store Server is runningon port --> " + port));
