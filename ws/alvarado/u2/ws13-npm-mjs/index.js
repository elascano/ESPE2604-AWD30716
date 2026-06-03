const http = require('node:http');

const hostname = '127.0.0.1';
const port = 4001;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html'); // THINK ABOUT THIS LINE later
    res.end('Hello, <b>Web Developers!</b> from <i>Dylan Alvarado</i>\n');
});

server.listen(port, hostname, () => {
    console.log(`Dylan's Server running at http://${hostname}:${port}/`);
});