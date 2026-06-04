import express from 'express';
const app = express();
const PORT = 4010;

app.get('/', (req, res) => {
  res.send('Welcome to my server, my name is <b><i>Gabriel Molina</i></b>');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});