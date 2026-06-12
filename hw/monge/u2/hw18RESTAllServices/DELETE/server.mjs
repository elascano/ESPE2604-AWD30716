import express from "express";
const app = express();
const port = 4011;

app.get('/', (req, res) => {
    res.send('Welcome to Ricardo server!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})