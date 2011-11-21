exports.run = function(req,res,get,post,cookie){
	var body = '',statu_code,gzip;
	var ff;
	try{
		var m = req.url.match(/\.(\w+)$/);
		if(m)
			m = m[1].toLowerCase();
		else
			m = '*';
		ff = getFile(req.url,m);
		if(ff[0]){
			body = ff[0];
			//gzip action
			gzip = MIME.needGzip(m);
			if(gzip){
				acceptEncoding = req.headers['accept-encoding'];
				if(acceptEncoding.match(/^gzip/)){
					res.setHeader('content-encoding','gzip');
				}else if(acceptEncoding.match(/^deflate/)){
					res.setHeader('content-encoding','deflate');
				}
			}
			// cache control action
			
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
		console.log("static file error");
		throw e;
	}
	res.response(body,statu_code);
}

var FS = require('fs');
var ZLIB = require('zlib');
var MIME = require('./mime');
var LOG = require('./log');
/**
 * 
 * return  [file-content,mime/type]
 */
function getFile(path,m){
	var mime, fstream;
	mime = MIME.getType(m);
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
