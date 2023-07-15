const fs = require('fs/promises');
const path = require('path');
const { selectAll } = require('./selectAll.js');
const { CSVParse } = require('./CSVParse.js');

async function loadDataFromDb() {
    let data = await fs.readFile(path.resolve(__dirname, '../src/db', 'workers.csv'), 'utf8');
    let workers = CSVParse(data, ['name', 'group', 'jobTitle']);
    let masters = selectAll(workers, 'jobTitle', 'мастер');
    let electricians = selectAll(workers, 'jobTitle', 'электромонтёр');
    let bosses = selectAll(workers, 'jobTitle', 'начальник участка');
    let workersWithFouthGroup = selectAll(workers, 'group', 'гр. IV');
    return ({
        masters,
        electricians,
        bosses,
        workersWithFouthGroup,
        lines: ['ВЛ 6кВ № 2-2', 'ВЛ 6кВ № 2-5', 'ВЛ 6кВ № 4-1', 'ВЛ 6кВ № 5-1', 'ВЛ 6кВ № 5-2', 'ВЛ 6кВ № 5-3']
    });
}
exports.loadDataFromDb = loadDataFromDb;