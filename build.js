const fs = require('fs/promises');
const path = require('path');
const { renderIndexPage } = require('./src/compiledPages.js').compiledPages;

fs.mkdir(path.resolve(__dirname, 'dist'), {recursive: true});
fs.writeFile(path.resolve(__dirname, 'dist', 'index.html'), renderIndexPage({
    lines: ['ВЛ 6кВ № 2-2', 'ВЛ 6кВ № 2-5', 'ВЛ 6кВ № 4-1', 'ВЛ 6кВ № 5-1', 'ВЛ 6кВ № 5-2', 'ВЛ 6кВ № 5-3'],
    workers: ["Дёмин А.П. гр. V", "Бахтияров Р.В. гр. V", "Сержанков С.Н. гр. V", "Корнеев А.А. гр. V"]
}));