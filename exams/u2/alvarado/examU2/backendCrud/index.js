require('dotenv').config();

const express   = require('express');
const connectDB = require('./config/db');

const app  = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectDB();

const tvRouter = require('./routes/tvRoutes');
app.use('/happytv/tv', tvRouter);

app.listen(port, () => {
    console.log(`CRUD Backend running on port ${port}`);
});
