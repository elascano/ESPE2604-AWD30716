import express from 'express';

const app = express();
const port = 4010;

app.get('/', (req, res) => {
  res.send('Welcome to my server! <b><i>my name is Gabriel Molina</i></b>');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});