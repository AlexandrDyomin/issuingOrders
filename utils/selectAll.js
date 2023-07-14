function selectAll(data, prop, value) {
    return data.filter((item) => {
        return item[prop] === value;
    });
}

exports.selectAll = selectAll;