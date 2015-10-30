'use strict';

var fs = require('fs');
var EE = require('events').EventEmitter;
var fileEvents = new EE();
var mapped = [];

var buf = fs.readFile(__dirname + '/bitmap1.bmp',function (err, data) {
  if (err) throw err;
  buf = new Buffer(data);
  // mapped = Array.prototype.map.call(data, function(num) {
  //   return num;
  // });
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
  this.headerArr = Array.prototype.splice.call(this.buffer, 0, 14);
  this.headerDIB = Array.prototype.splice.call(this.buffer, 14, 40);
  this.colorPalette = Array.prototype.splice.call(this.buffer, 55, 72);
  this.binaryData = [];
  this.colorArray = [];
};





fileEvents.on('madebuffer', function(buf) {
  var bitmap = new Bitmap(buf);
  // console.log('type: ' + bitmap.type);
  // console.log('size: ' + bitmap.size);
  // console.log('number of colors: ' + bitmap.numberOfColors);
  console.log('pixels start at: ' + bitmap.pixelStart);
  // console.log('bit depth: ' + bitmap.bitDepth);
  // console.log('width: ' + bitmap.width);
  // console.log('height: ' + bitmap.height);
  // console.log('raw header: ' + bitmap.header);
  // console.log('header array: ' + bitmap.headerArr);
  // console.log('header DIB array: ' + bitmap.headerDIB);
  // console.log('color palette: ' + bitmap.colorPalette);
  colors();

  function colors() {
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
    console.log(bitmap.colorArray);
    console.log(bitmap.colorArray.length);
  };
});

var FileReadImg = function(filename, callback){
  fs.readFile(filename, function(err,data){
    if(err) return callback(err,null);    
    else  return callback(null,data);
  });
};

var FileSaveImg = function(filename, data, callback){
  fs.writeFile(filename, data, function(err){
    if(err) throw err;
  });
};
