import express from "express";
const app = express();
const port = 4004;
app.get('/', (req, res)=>{
    res.send('Welcome to Andres server!');
});
app.listen(port, () => {
    console.log(`Andres Server is running on port ${port}`);
})