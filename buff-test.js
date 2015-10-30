var buf = new Buffer('hello world');

// console.log(buf.join(' '));
//this will not work because the buffer isn't actually an array

console.log(Array.prototype.join.call(buf, ' '));
// now this will work because we have used call to replace the default 'this' array with our 'buf' variable

console.log(process.argv.join(' '));


//invert the string 'hello world':
Array.prototype.forEach.call(buf, function(byte, index) {
  buf.writeUInt8(255 - byte, index)
});

console.log(buf.toString());
