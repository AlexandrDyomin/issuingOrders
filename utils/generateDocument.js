const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

async function generateDocument(template, values) {
    try {
        const zip = new PizZip(template);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        doc.render(values);
        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });
        return buf;
    } catch (err) {
        throw err;
    }
}

module.exports = generateDocument;