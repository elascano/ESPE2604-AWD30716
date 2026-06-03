import express from "express";

const app = express();
const hostname = "127.0.0.1";
const port = 4014;

app.get("/", (req, res) => {
  res.send("Welcome to David Server!");
});

const server = app.listen(port, hostname, () => {
  console.log(`David's Server running at http://${hostname}:${port}/`);
});
