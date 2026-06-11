const http = require("node:http");

const hostname = "127.0.0.1";
const port = 5016;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end("Hello, <b>Web Developers!</b> from <i>Alexander Torres</i>\n");
});

server.listen(port, hostname, () => {
  console.log(`Alexander's Node server running at http://${hostname}:${port}/`);
});
