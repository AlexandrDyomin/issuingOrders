const http = require('http');
let { routes } = require('./src/router.js');
const HOST = 'localhost';
const PORT = process.env.PORT || 8000;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite3',  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

// db.serialize(() => {
//     db.run("CREATE TABLE lorem (info TEXT)");

//     const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (let i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();

//     db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
//         console.log(row.id + ": " + row.info);
//     });
// });

// db.close();

const server = http.createServer();
server.on('request', handleRequest);
server.listen(PORT, HOST, handleConnection);

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
