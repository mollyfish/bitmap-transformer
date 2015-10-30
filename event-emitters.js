var EE = require('events').EventEmitter;
var fs = require('fs');
var fileEvents = new EE();

// we want to read somefile and do something with it
// we absolutely do not want to read anotherfile until somefile has been read

fileEvents.on('processdata', function(data) {
  console.log(data.toString());
});


fileEvents.on('donesomefile', function(data) {
  fs.readFile(__dirname + '/files/anotherfile.txt', function(err, data) {
    if (err) return console.log(err);
    fileEvents.emit('processdata', data);
  });
});


fs.readFile(__dirname + '/files/somefile.txt', function (err, data) {
  fileEvents.emit('donesomefile', data);
  if (err) return console.log(err);
  fileEvents.emit('processdata', data);
});

console.log('first!');


//for some reason this WILL NOT WORK without the __dirname  WTF
