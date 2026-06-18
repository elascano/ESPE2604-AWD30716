const port = process.env.PORT || 6013;
const express = require('express');
const app = express();
const puzzleRoutes = require('./routes/puzzleRoutes');


const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Esteban's system connected to MongoDB"));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rutas API
app.use("/puzzlestore", puzzleRoutes);


app.listen(port, () => {
    console.log(`Esteban's Puzzle Store server is running on port ${port}`);
});

