var Bitmap  = module.exports = exports = function(buffer) {
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

Bitmap.prototype.pullColors = function(callback) { 
  var initialPaletteLength = this.colorPalette.length;
  for(var i = 0; i < initialPaletteLength; i = i + 4) {
    var color = {};
    var colorArr = this.colorPalette.splice(0,4);
    color.a = colorArr[0];
    color.b = colorArr[1];
    color.g = colorArr[2];
    color.r = colorArr[3];
    this.colorArray.push(color);
  };
  var colorObjArr = this.colorArray;
  callback(colorObjArr);
};

Bitmap.prototype.invert = function(colorObjArr, callback) {
  invertColors = function(el, i, arr) {
    el.b = 255 - el.b;
    el.g = 255 - el.g;
    el.r = 255 - el.r;
  };
  // console.log(colorObjArr);
  colorObjArr.forEach(invertColors);
  callback(colorObjArr);
};

Bitmap.prototype.write = function(colorObjArr) {
  console.log(this.height);
  var self = this;
  writeToBuffer = function(el, i, arr) {
    self.buffer[53 + (i * 4)] = el.a;
    self.buffer[54 + (i * 4)] = el.b;
    self.buffer[55 + (i * 4)] = el.g;
    self.buffer[56 + (i * 4)] = el.r; 
  }
  colorObjArr.forEach(writeToBuffer);
};