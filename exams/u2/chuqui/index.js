const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = process.env.PORT || 8080;

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://kachuqui_db_user:Simon123@cluster0.x7strgx.mongodb.net/?appName=Cluster0';
mongoose.connect(mongoUri);

const db = mongoose.connection;
db.on('error', (error) => console.error('Mongo connection error:', error));
db.once('open', () => console.log("Kerly's System connected to MongoDb Database"));

app.use(express.json());

const pencilRoutes = require('./routes/pencils');
app.use('/api/pencils', pencilRoutes);

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'JSON inválido en el body de la petición' });
    }
    next(err);
});


app.listen(port, () => {
    console.log(`Kerly's Service is running on port ${port}`);
});

module.exports = app;