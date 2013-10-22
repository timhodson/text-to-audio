/**
 * Created with JetBrains PhpStorm.
 * User: txh
 * Date: 22/10/2013
 * Time: 11:21
 * To change this template use File | Settings | File Templates.
 */

var fs = require("fs");

var fileStats = [];
var Midi = require('jsmidgen');

var file = new Midi.File();

// could have separate tracks ?
var track = new Midi.Track();

file.addTrack(track);

// scale
var startNote = 36; // C2
var interval = 3;
var scale = {};
var alphabet = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];
var notes = 'C C#D D#E E#F F#G G#A A#B ';

for(var i=0; i < 26; i++){
    var midinote = startNote + (interval*i);
    var octave = Math.floor(midinote/12 -1);
    var note = notes.substring((midinote % 12) * 2, (midinote % 12) *2 + 2);
    scale[alphabet[i]] = note.replace(' ', '') + octave;
}

console.log(scale);

// define a bar and add four notes
// duration in ticks (128 per beat)

function addNotesFromText(char){
    track.addNote(0, scale[char], 128);
}




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
    //console.log(stats);
    for(stat in stats){
      Object.keys(stats[stat].chars).forEach(function(key){
          addNotesFromText(key);
      });
    }
    fs.writeFileSync('test.midi', file.toBytes(), 'binary');
});