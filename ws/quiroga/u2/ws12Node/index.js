const http = require('http');

const hostname = "127.0.0.1";
const port = 5013;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('Hello World from <b>Esteban</b>\n');
});

server.listen(port, hostname, () => {
    console.log(`Esteban's server running at http://${hostname}:${port}/`);
});