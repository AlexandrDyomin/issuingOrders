const http = require('http');
let { routes } = require('./src/router.js');

const HOST = 'localhost';
const PORT = 8000;

const server = http.createServer();
server.on('request', handleRequest);
server.listen(PORT, HOST, handleConnection);


async function handleRequest(req, res) {  
    res.setHeader('Access-Control-Allow-Origin', `http://${HOST}:${PORT}`);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    routes[req.url] ? routes[req.url](req, res) : routes.default(req, res);
}

function handleConnection() {
    console.log(`Server is running on http://${HOST}:${PORT}`);
}