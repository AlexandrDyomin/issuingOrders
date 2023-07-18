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
    
    let info = await fs.readFile('./src/db/overheadLines.csv', 'utf-8');
    let lines = CSVParse(info, ['name']);

    let activities = {};
    for (let item of CSVParse(info, ['line', 'substation', 'box', 'actions'])) {
        activities[item.line] = {
            electricalInstalation: `${item.substation}, ${item.box}`,
            actions: item.actions.split(';')
        };
    }

    fs.writeFile(path.resolve(__dirname, 'dist', 'index.html'), renderIndexPage({
        masters,
        electricians,
        bosses,
        workersWithFouthGroup,
        lines,
        activities
    }));
})()