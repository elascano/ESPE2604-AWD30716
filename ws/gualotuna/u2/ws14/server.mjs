import express from 'express';
const app = express();
const port = 4009;

app.get('/', (req, res) => {
    res.send('welcome <b>Web Developers!</b> to <i>Brayan Server </i>');
});
app.listen(port, () => {
    console.log(`Brayan's Server running at http://localhost:${port}/`);
});
