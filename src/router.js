const fs = require('fs/promises');
const path = require('path');

const toPdf = require('office-to-pdf');
const PDFMerger = require('pdf-merger-js');

const generateDocument = require('../utils/generateDocument.js');
const { renderIndexPage } = require('./compiledPages.js').compiledPages;
const { processData } = require('../utils/processData.js');
let dataFromDb = require('../utils/loadDataFromDb.js').loadDataFromDb();

let routes = {
    '/order': function postOrder(req, res) {
        let body = []; 
        req.on('data', (chunk) => accumulateChunks(body, chunk));
        req.on('end', () => mergeChunks(body));
        req.addListener('end', makeHandlerEnd(res, body));
    },
    '/': async function postIndexPage(req, res) {
        try {
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200);
            res.end(renderIndexPage(await dataFromDb));
        } catch (err) {
            console.log(err);
            res.writeHead(500);
            res.end(err);
        }
    },
    default: function postPage404(req, res) {
        res.writeHead(404);
        res.end('Page not found');
    }
};

function accumulateChunks(container, chunk) {
    container.push(chunk);
}

function mergeChunks(container) {
    return Buffer.concat(container);
}

function makeHandlerEnd(res, dataFromClient) {
    return handleEnd;
    
    async function  handleEnd() {
        try {
            let emptyOrder = await readEmptyOrder();
            let deserializedData = processData(JSON.parse(dataFromClient.toString()));
            let merger = new PDFMerger();
            
            for (let part of deserializedData) {
                let emptyOrderCopy = Buffer.concat([emptyOrder]);
                let order = await generateDocument(emptyOrderCopy, part);
                let pdf = await toPdf(order);
                await merger.add(pdf);
            }
            
            writeHeaders();
            res.end(await merger.saveAsBuffer());
        } catch (err) {
            console.log(err);
            res.writeHead(500);
            res.end(err.message);
        }
    }  

    function writeHeaders() {
        res.setHeader('Content-Type', 'application/pdf');
        res.writeHead(200);
    }
    
    function readEmptyOrder() {
        try {
            return fs.readFile(path.resolve(process.cwd(), 'src', 'documentTemplates', 'empty_form.docx'));
        } catch (err) {
            throw err;
        }
    }
}

exports.routes = routes;