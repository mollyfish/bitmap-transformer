var querystring = require('querystring');
var fs = require('fs');
var formidable = require('formidable');

function start(res) {
  console.log('Request handler "start" was called');
  res.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile('index.html', 'html', function (err, data) {
    if (err) throw err;
    console.log(data);
  });
  res.end();
}

function upload(res, req) {
  console.log('Request handler "upload" was called.');

  var form = new formidable.IncomingForm();
  console.log('about to parse');
  form.parse(req, function(err, fields, files) {
    console.log('parsing done');
    fs.rename(files.upload.path, 'tmp/test.png', function(err) {
      if(err) {
        fs.unlink('tmp/test.png');
        fs.rename(files.upload.path, 'tmp/test.png');
      }
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Received image: <br />');
    res.write('<img src="/show" />');
    res.end();
  });
}

function show(res) {
  console.log('Request handler "show" was called.');
  res.writeHead(200, {'Content-Type': 'image/png'});
  fs.createReadStream('tmp/test.png').pipe(res);
}

exports.start = start;
exports.upload = upload;
exports.show = show;
