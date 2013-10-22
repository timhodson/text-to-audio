var fs = require("fs");

var fileStats = [];

function readLines(input, lineFunc, cb) {
    var remaining = '';

    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            lineFunc(line);
            index = remaining.indexOf('\n');
        }
    });

    input.on('end', function() {
        if (remaining.length > 0) {
            lineFunc(remaining);
        }
        cb(null, fileStats);
    });
}

function lineStats(data) {
    var wordCount = data.split(" ").length;

    var chars = {};
    data.toLowerCase().replace( /[^a-z]/g ,"").split("").sort().forEach(function(c){
        chars[c] ? ++chars[c] : chars[c] = 1;
    });

    var nonchars = {};
    data.toLowerCase().replace( /[a-z]/g ,"").split("").sort().forEach(function(c){
        nonchars[c] ? ++nonchars[c] : nonchars[c] = 1;
    });

    fileStats.push({
        line: data,
        words: wordCount,
        chars: chars,
        nonchars: nonchars
    });
}

var input = fs.createReadStream('charge-of-light-brigade.txt');
readLines(input, lineStats, function(err, stats) {
    console.log(stats);
});