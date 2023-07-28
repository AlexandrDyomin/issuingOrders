const fs = require('fs/promises');
const path = require('path');

const PDFMerger = require('pdf-merger-js');
// const { convertWordFiles } = require('convert-multiple-files-ul');
var builder = require('docx-builder');
var docx = new builder.Document();

const generateDocument = require('../utils/generateDocument.js');
const { renderIndexPage } = require('./compiledPages.js').compiledPages;
const { processData } = require('../utils/processData.js');
let { dataForTemplate } = require('../utils/loadDataFromDb.js');

let routes = {
    '/activities': async function postActivities(req, res) {
        let url = new URL(req.headers.host + req.url);
        let line = decodeURI(url.searchParams.get('line'));
        let activities = JSON.stringify((await dataForTemplate).activities[line]);
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(activities);
    },
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
            res.end(renderIndexPage(await dataForTemplate));
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
            // let merger = new PDFMerger();
            for (let i = 0; i < deserializedData.length; i++) {
                let emptyOrderCopy = Buffer.concat([emptyOrder]);
                let order = await generateDocument(emptyOrderCopy, deserializedData[i]);
                let orderPath = path.resolve(process.cwd(), 'tmp', `order${i}.docx`);
                await fs.writeFile(orderPath, order);
                docx.insertDocxSync(orderPath); 
                // let pathOutput = await convertWordFiles(path.resolve(process.cwd(), 'tmp', `order${i}.docx`), 'pdf', path.resolve(process.cwd(), 'tmp'));
                // let pdfBuf = await fs.readFile(pathOutput);
                // await merger.add(pdfBuf);
            }
            // writeHeaders();
            // res.end(await merger.saveAsBuffer());
            // let pdfOrderPath =  path.resolve(process.cwd(), 'tmp', `order.docx`);
            // docx.save(pdfOrderPath, function(err){
            //     if(err) console.log(err);
            // });
            // let o = await fs.readFile(pdfOrderPath);
            res.end('o');

        } catch (err) {
            console.log(err);
            res.writeHead(500);
            res.end(err.message);
        }
    }  

    function writeHeaders() {
        // res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

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
