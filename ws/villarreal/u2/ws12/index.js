const http = require("node:http");
const hostname = "127.0.0.1";
const port = 5017;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello, <b>Web Developers!</b> from <i>Evelyn Villarreal</i>");
});
server.listen(port, hostname, () => {
    console.log(`Evelyn Server running at http://${hostname}:${port}/`);
});