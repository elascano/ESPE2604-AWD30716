import express from "express";

const app = express();

const port = 4003;

app.get('/', (req, res) => {

    res.send('Welcome to Jilmar Calderon server!');
});

app.listen(port, () => {

    console.log(`Server is running on port ${port}`);
});