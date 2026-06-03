import express from 'express';
const app = express();
const port = 4017;
app.get('/', (req, res) => {
  res.send('Welcome to Evelyn server!');
});
app.listen(port, () => {
  console.log(`Evelyn Server is running on port ${port}`);
});