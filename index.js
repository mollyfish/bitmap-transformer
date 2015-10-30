'use strict';

var fs = require('fs');
var EE = require('events').EventEmitter;
var fileEvents = new EE();
var Bitmap = require(__dirname + '/lib/bitmap_constructor');
var mapped = [];
var bitmap;


var buf = fs.readFile(__dirname + '/bitmap1.bmp',function (err, data) {
  if (err) throw err;
  buf = new Buffer(data);
  fileEvents.emit('madebuffer', buf);
});

fileEvents.on('madebuffer', function(buf) {
  bitmap = new Bitmap(buf);

  bitmap.pullColors(function(colorObjArr) {
    fileEvents.emit('madecolorarr', colorObjArr);
  });  

});

fileEvents.on('madecolorarr', function(colorObjArr) {
  // this one is hearing the end of pullColors();
  // console.log('About to console log the orig obj');
  bitmap.invert(colorObjArr, function(colorObjArr) {
    fileEvents.emit('invertedcolors', colorObjArr);
  });
});

fileEvents.on('invertedcolors', function(colorObjArr) {
  // this one is hearing the end of invert();
  // console.log('About to console log the new obj');
  bitmap.write(colorObjArr);
  fileEvents.emit('writtentobuffer');
});

fileEvents.on('writtentobuffer', function() {
  var newPalette = Array.prototype.slice.call(bitmap.buffer, 53, 181);
  // console.log(newPalette);
  fs.writeFile(__dirname + '/invert.bmp', bitmap.buffer, function (err) {
    if (err) throw err;
    // console.log('fingers crossed');
  });
});
