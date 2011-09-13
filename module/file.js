exports.run = function(req,res,get,post,cookie){
	var body = '',statu_code;
	var ff;
	try{
		ff = getFile(req.url,res.charset);
		if(ff[0]){
			body = ff[0];
			res.setHeader('content-type',ff[1]);
		}else{
			if(req.url.match(/\.ico$/)){
				console.log('[WARN]using LS.ico instead!!!');
				ff = getFile(__dirname + '/../wwwroot/favicon.ico',res.charset);
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
var MIME = require('./mime');
/**
 * 
 * return  [file-content,mime/type]
 */
function getFile(path,charset){
	var m = path.match(/\.(\w+)$/);
	var mime,file,td,fstat,buffer;
	try{
		fd = FS.openSync(path, 'r');
	}catch(e){
		console.log("[WARN]File not exist!!! [" + path + ']');
		return ['','text/html'];
	}
	fstat = FS.fstatSync(fd);
	
	buffer = new Buffer(fstat.size);
	FS.readSync(fd,buffer,0,fstat.size,0);
	if(m)
		m = m[1].toLowerCase();
	else
		m = '*';
	mime = MIME.getType(m);
	return [buffer,mime];
}