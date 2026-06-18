const express = require('express');

const app = express();
const port = process.env.PORT || 8081;

app.use(express.json());

const businessRoutes = require('./routes/business');
app.use('/api/business', businessRoutes);

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'JSON inválido en el body de la petición' });
    }
    next(err);
});

app.listen(port, () => {
    console.log(`Business Rule Service is running on port ${port}`);
});

module.exports = app;
