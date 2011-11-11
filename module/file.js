exports.run = function(req,res,get,post,cookie){
	var body = '',statu_code;
	var ff;
	try{
		ff = getFile(req.url);
		if(ff[0]){
			body = ff[0];
			res.setHeader('content-type',ff[1]);
		}else{
			if(req.url.match(/\.ico$/)){
				console.log('[WARN]using LS.ico instead!!!');
				ff = getFile(__dirname + '/../wwwroot/favicon.ico');
			}else{
				ff = [''];
			}
			if(ff[0]){
				body = ff[0];
				res.setHeader('content-type',ff[1]);
			}else{
				statu_code = 404;
				body = '<h1>Page not find!!!</h1>';
			}
		}
	}catch(e){
		LOG.log('[Error:Controller] error to run controller:' + controller);
		statu_code = 500;
		body = '<h1>Server internal Error!!!</h1>';
	}
	res.response(body,statu_code);
}

var FS = require('fs');
var ZLIB = require('zlib');
var MIME = require('./mime');
/**
 * 
 * return  [file-content,mime/type]
 */
function getFile(path,charset){
	
	var m = path.match(/\.(\w+)$/);
	var mime, fstream, gzip;
	if(m)
		m = m[1].toLowerCase();
	else
		m = '*';
	mime = MIME.getType(m);
	gzip = MIME.needGzip(m);
	
	try{
		fstream = FS.createReadStream(path);
	}catch(e){
		console.log("[WARN]File not exist!!! [" + path + ']');
		return ['','text/html'];
	}
	return [fstream,mime];
}


/**
 *  var raw = fs.createReadStream('index.html');
  var acceptEncoding = request.headers['accept-encoding'];
  if (!acceptEncoding) {
    acceptEncoding = '';
  }

  // Note: this is not a conformant accept-encoding parser.
  // See http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (acceptEncoding.match(/\bdeflate\b/)) {
    response.writeHead(200, { 'content-encoding': 'deflate' });
    raw.pipe(zlib.createDeflate()).pipe(response);
  } else if (acceptEncoding.match(/\bgzip\b/)) {
    response.writeHead(200, { 'content-encoding': 'gzip' });
    raw.pipe(zlib.createGzip()).pipe(response);
  } else {
    response.writeHead(200, {});
    raw.pipe(response);
  }
 */
