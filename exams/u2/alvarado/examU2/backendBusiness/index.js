require('dotenv').config();

const express = require('express');
const app     = express();
const port    = process.env.PORT || 3001;

app.use(express.json());

const businessRouter = require('./routes/businessRoutes');
app.use('/happytv/tv', businessRouter);

app.listen(port, () => {
    console.log(`Business Backend running on port ${port}`);
});
