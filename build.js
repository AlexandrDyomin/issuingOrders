const fs = require('fs/promises');
const path = require('path');
const { renderIndexPage } = require('./src/compiledPages.js').compiledPages;

fs.mkdir(path.resolve(__dirname, 'dist'), {recursive: true});
fs.writeFile(path.resolve(__dirname, 'dist', 'index.html'), renderIndexPage({
    workers: ["Дёмин А.П. гр. V", "Бахтияров Р.В. гр. V", "Сержанков С.Н. гр. V", "Корнеев А.А. гр. V"]
}));