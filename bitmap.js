'use strict';

var fs = require('fs');
var EE = require('events').EventEmitter;
var fileEvents = new EE();
var mapped = [];
var bitmap;

var buf = fs.readFile(__dirname + '/bitmap1.bmp',function (err, data) {
  if (err) throw err;
  buf = new Buffer(data);
  fileEvents.emit('madebuffer', buf);
});

var Bitmap = function(buffer) {
  this.buffer = buffer;
  this.type = this.buffer.toString('utf-8', 0, 2);
  this.size = this.buffer.readUInt32LE(2);
  this.numberOfColors = this.buffer.readUInt16LE(46);
  this.pixelStart = this.buffer.readUInt32LE(10);
  this.bitDepth = this.buffer.readUInt16LE(28);
  this.width = this.buffer.readUInt32LE(18);
  this.height = this.buffer.readUInt32LE(22);
  this.header = this.buffer.readUInt32LE(14);
  this.headerArr = Array.prototype.slice.call(this.buffer, 0, 14);
  this.headerDIB = Array.prototype.slice.call(this.buffer, 14, 55);
  // what is causing this overlap??? Why start at 53???
  this.colorPalette = Array.prototype.slice.call(this.buffer, 53, 181);
  this.binaryData = [];
  this.colorArray = [];
};

fileEvents.on('madebuffer', function(buf) {
  bitmap = new Bitmap(buf);
  
  function colors() { 
    // console.log(bitmap.colorPalette);   
    var initialPaletteLength = bitmap.colorPalette.length;
    for(var i = 0; i < initialPaletteLength; i = i + 4) {
      var color = {};
      var colorArr = bitmap.colorPalette.splice(0,4);
      color.a = colorArr[0];
      color.b = colorArr[1];
      color.g = colorArr[2];
      color.r = colorArr[3];
      bitmap.colorArray.push(color);
    };
    var colorObjArr = bitmap.colorArray;
    console.log(colorObjArr);
    fileEvents.emit('madecolorarr', colorObjArr);
  };
  colors();
});

fileEvents.on('madecolorarr', function(colorObjArr) {
  function invertColors(el, i, arr) {
    el.b = 255 - el.b;
    el.g = 255 - el.g;
    el.r = 255 - el.r;
  }
  colorObjArr.forEach(invertColors);
  console.log(colorObjArr);
  fileEvents.emit('invertedcolors', colorObjArr);
});

fileEvents.on('invertedcolors', function(colorObjArr) {
  function writeToBuffer(el, i, arr) {
    bitmap.buffer[53 + (i * 4)] = el.a;
    bitmap.buffer[54 + (i * 4)] = el.b;
    bitmap.buffer[55 + (i * 4)] = el.g;
    bitmap.buffer[56 + (i * 4)] = el.r; 
  }
  colorObjArr.forEach(writeToBuffer);
  fileEvents.emit('writtentobuffer');
});

fileEvents.on('writtentobuffer', function() {
  var newPalette = Array.prototype.slice.call(bitmap.buffer, 53, 181);
  console.log(newPalette);
  fs.writeFile(__dirname + '/invert.bmp', bitmap.buffer, function (err) {
    if (err) throw err;
    console.log('fingers crossed');
  });
});
