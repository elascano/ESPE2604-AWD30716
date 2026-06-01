import express from 'express';
const app = express();
const port = 4013;

app.get('/', (req, res) => {
  res.send('Welcome to Estebans Server!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});