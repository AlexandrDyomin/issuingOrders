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
    let info = await fs.readFile('./src/db/overheadLines.csv', 'utf-8');
    let lines = CSVParse(info, ['name']);
    
    let activities = {};
    for (let item of CSVParse(info, ['line', 'electricalInstalation', 'box', 'actions'])) {
        let electricalInstalation = {
            name: `${item.electricalInstalation} ${item.box}`,
            actions: item.actions.split(';')
        };
        if (activities[item.line]) {
            activities[item.line].pcp = electricalInstalation;
            continue;
        }
        activities[item.line] = {
            substation: electricalInstalation
        };
    }

    return {
        masters,
        electricians,
        bosses,
        workersWithFouthGroup,
        lines,
        activities
    }
}

exports.dataForTemplate = loadDataFromDb();