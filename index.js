const http = require('http');
let { routes } = require('./src/router.js');
const HOST = '0.0.0.0';
const PORT = process.env.PORT || 8000;

const server = http.createServer();
server.on('request', handleRequest);
server.listen(PORT, handleConnection);

async function handleRequest(req, res) {  
    res.setHeader('Access-Control-Allow-Origin', `http://${HOST}:${PORT}`);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    let url = new URL(`${req.headers.host}${req.url}`);
    let pathname = url.pathname.match(/\/.*/)[0];
    routes[pathname] ? routes[pathname](req, res) : routes.default(req, res);
}

function handleConnection() {
    console.log(`Server is running on http://${HOST}:${PORT}`);
}

if (process.env.NODE_ENV === 'dev') {
    require('./build.js');
}
