let formatter = {}
formatter.simStatusColor = function (val) {
    let color = '#909399';
    if (val === '正使用') {
        color = '#67c23a';
    }
    if (val === '在用') {
        color = '#67c23a';
    }
    if (val === '测试期') {
        color = '##409eff';
    }
    if (val === '停机') {
        color = '#f56c6c';
    }
    return color
}

formatter.operNameColor = function (val) {
    let color = '#909399';
    if (val.search('电信') !== -1) {
        color = '#19be6b';
        return color;
    }
    if (val.search('移动') !== -1) {
        color = '#0085d0';
        return color;
    }
    if (val.search('联通') !== -1) {
        color = '#e60000';
        return color;
    }
    return color
}
formatter.operName = function (val) {
    let text = '';
    if (val == 1) {
        text = '中国电信';
    }
    if (val == 2) {
        text = '中国移动';
    }
    if (val == 3) {
        text = '中国联通';
    }

    return text
}


export default formatter

