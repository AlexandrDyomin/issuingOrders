const fs = require('fs/promises');
const path = require('path');
const generateDocument = require('../utils/generateDocument.js');
let { renderIndexPage } = require('./compiledPages.js').compiledPages;

const toPdf = require('office-to-pdf');
const PDFMerger = require('pdf-merger-js');



let routes = {
    '/order': function postOrder(req, res) {
        let body = []; 
        req.on('data', (chunk) => accumulateChunks(body, chunk));
        req.on('end', () => mergeChunks(body));
        req.addListener('end', makeHandlerEnd(res, body));
    },
    '/': function postIndexPage(req, res) {
        try {
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200);
            res.end(renderIndexPage());
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

function makeHandlerEnd(res, data) {
    return handleEnd;
    
    function writeHeaders() {
        const docxType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const pdfType = 'application/pdf';
        res.setHeader('Content-Type', pdfType);
        // res.setHeader('Content-Disposition', `attachment;filename=${encodeURI(`Наряд № ${data.number}}.docx`)}`);
        res.writeHead(200);
    }

    async function  handleEnd() {
        try {
            const order = await generateDocument(await readEmptyOrder(), deserialize(data));
            writeHeaders();
            let pdf = await toPdf(order);
            res.end(pdf);
        } catch (err) {
            console.log(err);
            res.writeHead(500);
            res.end(err.message);
        }
    }  
    
    function readEmptyOrder() {
        try {
            return fs.readFile(path.resolve(process.cwd(), 'src', 'documentsTemplates', 'empty_form.docx'));
        } catch (err) {
            throw err;
        }
    }
}

function deserialize(buf) {
    try {
        return JSON.parse(buf.toString());
    } catch (err) {
        throw err;
    }
}

exports.routes = routes;