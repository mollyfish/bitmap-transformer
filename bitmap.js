'use strict';

var fs = require('fs');
var EE = require('events').EventEmitter;
var fileEvents = new EE();
var mapped = [];

var Bitmap = function(buffer) {
  this.buffer = buffer;
  this.numberOfColors = this.buffer.readUInt16LE(46);
  this.pixelStart = this.buffer.readUInt32LE(10);
  this.bitDepth = this.buffer.readUInt16LE(28);
  this.width = this.buffer.readUInt32LE(18);
  this.height = this.buffer.readUInt32LE(22);
  this.header = this.buffer.readUInt32LE(14);
  this.headerStr = Array.prototype.splice.call(this.buffer, 0, 14);
  this.headerDIB = Array.prototype.splice.call(this.buffer, 14, 40);
  

  this.colorPalette = Array.prototype.splice.call(this.buffer, 54, buffer.length);
  this.binaryData = [];
  this.colorArray = [];
};



var buf = fs.readFile(__dirname + '/bitmap1.bmp',function (err, data) {
  if (err) throw err;
  buf = new Buffer(data);
  // console.log(data.toString('utf-8', 0, 2));
  // console.log('size: ' + data.readUInt32LE(2) + ' bytes');
  // // ls -la in terminal will show byte size to check the above output
  // console.log('pixel data starts at: ' + data.readUInt32LE(10));
  // console.log('bit depth: ' + data.readUInt16LE(28));
  // mapped = Array.prototype.map.call(data, function(num) {
  //   return num;
  // });
  fileEvents.emit('madebuffer', buf);
});

fileEvents.on('madebuffer', function(buf) {
  var bitmap = new Bitmap(buf);
  console.log(bitmap.colorPalette.length);
  colors();


  function colors() {
    for(var i = 0; i < (bitmap.colorPalette.length); i = i + 3) {
      var colorObject = {};
      // color order dictated by endianness?
      colorObject.blue = bitmap.colorPalette[i]; 
      colorObject.green = bitmap.colorPalette[i + 1];
      colorObject.red = bitmap.colorPalette[i + 2]; 
      console.log(colorObject);
      // last pixel has undefined for red...this feels wrong!
    };
  }


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
