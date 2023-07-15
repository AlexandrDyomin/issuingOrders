function processData(dataFromClient) {
    let processedData = [];
    let emptyObj = {
        number: '',
        additionalOrder: '',
        leader: '',
        leaderInitials: '',
        allowing: '',
        alowingInitials:'',
        foreman: '',
        foremanInitials: '',
        watching: '',
        workers1: '',
        workers2: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        giving: '',
        givingInitials:'',
        worker1: '',
        worker2: '',
        worker3: '',
        overheadLine: '',
        supports: '',
        dateIssue: '',
        timeIssue: '',
        mission1: '',
        mission2: '',
        mission3: '',
        mission4: '',
        electricalInstalation1: '',
        electricalInstalation2: '',
        electricalInstalation3: '',
        electricalInstalation4: '',
        electricalInstalation5: '',
        electricalInstalation6: '',
        electricalInstalation7: '',
        action1: '',
        action2: '',
        action3: '',
        action4: '',
        action5: '',
        action6: '',
        action7: ''
    }

    data = { 
        ...emptyObj, 
        ...dataFromClient,
        ...{
            leaderInitials: deleteGroup(dataFromClient.leader),
            allowingInitials: deleteGroup(dataFromClient.allowing),
            foremanInitials: deleteGroup(dataFromClient.foreman),
            givingInitials: deleteGroup(dataFromClient.leader),
        }
    }

    let groups = prepareDataForTables(data.workers);
    let strings = prepareStringsWithWorkers(data.workers);
    let mission = arrayOfArraysToArrayOfObjects(
        splitString(data.mission, [95, 110, 110, 110]),
        ['mission1', 'mission2', 'mission3', 'mission4']
    );

    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        let str = strings[i] || {};
        let missionParts = mission[i] || {}
        let firstObj = i === 0 ? data : emptyObj;
        let obj = { 
            ...firstObj, 
            ...group, 
            ...str,
            ...missionParts,
            number : data.number,
            dateIssue: data.dateIssue,
            timeIssue: data.timeIssue,
            additionalOrder: i === 0 ? '' : 'Дополнительный бланк',
            givingInitials: data.givingInitial
        };
        processedData.push(obj);
    }
    
    delete processedData[0].workers;
    delete processedData[0].mission;

    return processedData; 

    function prepareDataForTables(workers, start = 0) {
        let numberOfWorkerGroups = calcNumberOfWorkerGroups();
        let groups = [];
    
        (function split(start) {
            if (start === numberOfWorkerGroups - 1) {
                groups.push(createObj(workers.slice(start*2)));
                return;
            }
            let arr = workers.slice(start*2, start*2+2);
            arr.push('См. дополнительный бланк');
            groups.push(createObj(arr));
            
            split(++start);
        })(start);
    
        return groups;
    
        function calcNumberOfWorkerGroups() {
            const maxNumberWorkers = 3;
            if (workers.length <= maxNumberWorkers) {
                var numberOfWorkerGroups = 1;
            }
            numberOfWorkerGroups  = Math.ceil(numberOfWorkerGroups || (workers.length - maxNumberWorkers) / (maxNumberWorkers - 1) + 1);
            return numberOfWorkerGroups;
        }
    
        function createObj(arr) {
            let obj = {};
            for (let i = 0, prop = 'worker'; i < 3; i++) {
                let value = arr[i] ? deleteGroup(arr[i]) : '';
                obj[prop + (i + 1)] = value;
            }
            return obj;
        }
    
    }

    function deleteGroup(str) {
        return str.replace(/\s*гр.\s*\D+/, '');
    }


    function prepareStringsWithWorkers(workers, start = 0) {
        const WORKERS_LINE_1_LENGTH = 88;
        const WORKERS_LINE_2_LENGTH = 98;
        let strings = [];
        
        (function prepare(start) {
            let separator = '';
            for (var i = start, str1 = '', str2 = '', stop; i < workers.length; i++) {
                if (str1.length + workers[i].length + separator.length <= WORKERS_LINE_1_LENGTH) {
                    separator = ', '
                    str1 += workers[i] + separator;
                    continue;
                }
                stop = i;
                separator = '';
                for (let i = stop; i < workers.length; i++) {
                    if (str2.length + workers[i].length + separator.length <= WORKERS_LINE_2_LENGTH) {
                        separator = ', ';
                        str2 += workers[i] + separator;
                        continue;
                    }
                    str2 = 'См. дополнительный бланк';
                    break;
                }
                break;
            }
            
            str1 = str1.replace(/\s$/, '');
            if (str2 !== 'См. дополнительный бланк') {
                str1 = str2 ? str1 : str1.replace(/,$/, '');
    
                str2 = str2.replace(/(,\s)$/, '');
                strings.push({workers1: str1, workers2: str2});
                return;
            }
            
            strings.push({workers1: str1, workers2: str2});
            prepare(stop);
        })(start)
    
        return strings;
    }

    function splitString(str, lengths, start = 0, stop = start + lengths[0], res = []) {
        let strings = [];

        if (str.length <= lengths[0]) {
            strings.push(str);
            for (let i = 0; i < lengths.length - 1; i++) {
                strings.push('');
            }
            res.push(strings);
            return res;
        }

        for (let i = 0; i < lengths.length; i++) {
            if (str[stop] === ' ') {
                var strPart = str.slice(start, stop);
                start = i === 2 ? start : stop + 1;
                stop = lengths[i+1] ? stop + lengths[i+1] : stop + lengths[0];
                
            } else {
                let idx = str.lastIndexOf(' ', stop);
                stop = lengths[i+1] ? idx + lengths[i+1] : stop + lengths[0];
                strPart = str.slice(start, idx);
                start = i === lengths.length - 1 ? start : idx + 1;
            }
            if (i === lengths.length - 1 && strings[i-1] && stop <= str.length) {
                strPart = 'См. дополнительный бланк';
                stop -= lengths[0];
            }
            strings.push(strPart);	
        }

        res.push(strings)
        if (stop <= str.length) {
            return splitString(str, lengths, start, stop, res);
        }

        let lastStrindex;
        let lastStr = strings.findLast((str, i) => {
            lastStrindex = i;
            return str.length > 0 && str !== 'См. дополнительный бланк';
        });
        
        let rest = str.slice(start);
        if ((lastStr + rest).length < lengths[lastStrindex]) {
            strings[lastStrindex] = lastStr + ' ' + rest;
        } else {
            strings[lastStrindex + 1] = rest;
        }

        return 	res;
    }


    function arrayOfArraysToArrayOfObjects(arr, props) {
        let res = [];
        for (let i = 0; i < arr.length; i++) {
            res.push({});
            for (let k = 0; k < arr[i].length; k++) {
                res[i][props[k]] = arr[i][k];
            }
        }
        return res;
    }
}

exports.processData = processData;