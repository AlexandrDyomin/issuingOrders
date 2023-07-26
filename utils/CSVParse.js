function CSVParse(str, props) {
    return (splitIntoRows(str)
        .map(splitIntoCells))
        .map(ArrayToObject.bind(null, props));

    function splitIntoRows(str) {
        return str.split('\n');
    }

    function splitIntoCells(row) {
        return row.split(',');      
    }

    function ArrayToObject(props, arr) {
        let obj = {};  
        props.forEach((prop, i) => obj[prop] = arr[i]);
        return obj;
    }
}

exports.CSVParse = CSVParse;