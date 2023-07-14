const fs = require('fs/promises');
const path = require('path');
const { renderIndexPage } = require('./src/compiledPages.js').compiledPages;
const { CSVParse } = require('./utils/CSVParse.js');
const { selectAll } = require('./utils/selectAll.js');

fs.mkdir(path.resolve(__dirname, 'dist'), {recursive: true});
(async () => {
    let data = await fs.readFile(path.resolve(__dirname, 'src/db', 'workers.csv'), 'utf8');
    let workers = CSVParse(data, ['name', 'group', 'jobTitle']);
    let masters = selectAll(workers, 'jobTitle', 'мастер');
    let electricians = selectAll(workers, 'jobTitle', 'электромонтёр');
    let bosses = selectAll(workers, 'jobTitle', 'начальник участка');
    let workersWithFouthGroup = selectAll(workers, 'group', 'гр. IV');

    fs.writeFile(path.resolve(__dirname, 'dist', 'index.html'), renderIndexPage({
        masters,
        electricians,
        bosses,
        workersWithFouthGroup,
        lines: ['ВЛ 6кВ № 2-2', 'ВЛ 6кВ № 2-5', 'ВЛ 6кВ № 4-1', 'ВЛ 6кВ № 5-1', 'ВЛ 6кВ № 5-2', 'ВЛ 6кВ № 5-3']
    }));
})()