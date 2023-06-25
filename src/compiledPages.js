const pug = require('pug');

let compiledPages = {
    renderIndexPage: pug.compileFile('./index.pug')
}

exports.compiledPages = compiledPages;