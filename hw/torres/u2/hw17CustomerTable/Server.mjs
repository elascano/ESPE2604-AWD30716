import express from "express";

const app = express();
const port = 4017;

app.get("/", (req, res) => {
  res.send("Welcome to Alexander Torres' homework 17 Express server!");
});

app.listen(port, () => {
  console.log(`Alexander's Express server is running on http://localhost:${port}`);
});
