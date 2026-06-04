const http = require('node:http');
const PORT = 5010;
const hostname = '127.0.0.1';

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('Hello World, mi name is <b><i>Gabriel Molina</i></b> \n');
});

server.listen(PORT, hostname, () => {
    console.log(`Gabriel's Server running at http://${hostname}:${PORT}/`);
});