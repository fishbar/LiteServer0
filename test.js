var zlib = require('zlib');
var http = require('http');
var fs = require('fs');
http.ServerResponse.prototype.response = function(body,acceptEncoding){
	var gzip;
	if (acceptEncoding.match(/\bdeflate\b/)) {
	    this.writeHead(200, { 'content-encoding': 'deflate' });
	    gzip = body.pipe(zlib.createDeflate());
	  } else if (acceptEncoding.match(/\bgzip\b/)) {
	    this.writeHead(200, { 'content-encoding': 'gzip' });
	    gzip = body.pipe(zlib.createGzip());
	  } else {
	    this.writeHead(200, {});
	    gzip = body;
	  }
	  gzip.pipe(this);
}
http.createServer(function(request, response) {
  var raw = getFile('wwwroot/index.html');
  var acceptEncoding = request.headers['accept-encoding'];
  if (!acceptEncoding) {
    acceptEncoding = '';
  }
	response.response(raw,acceptEncoding);
}).listen(80);

function getFile(path){
	return fs.createReadStream(path);
}
