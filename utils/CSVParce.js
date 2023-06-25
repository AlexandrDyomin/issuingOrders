function CSVParse(str) {
    return (splitIntoRows(str)
        .map(splitIntoCells));

    function splitIntoRows(str) {
        return str.split('\n');
    }

    function splitIntoCells(row) {
        return row.split(',');      
    }
}

exports.CSVParse = CSVParse;