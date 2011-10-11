/** 
 * 配置log信息的输出
 * 	log 类型如下所列
 */
var logcfg = {
	'info'		: true,
	'error'	: true,
	'warn'	: true,
	'rewrite'	: true,
	'access'	: true,
	'debug'	: true,
};
var fs = require('fs');
// 配置 log 控制
exports.config = function(obj){
	for(var i in obj){
		logcfg[i] = obj[i];
	}
}
// info 级别的输出
exports.info = function(msg){
	console.log(msg);
}
// error 级别的输出
exports.error = function(msg){
	
}
exports.warn = function(msg){
	
}

var fd_cache = {};
function writeLog(msg,path,level){
	if(path === true){ // std out
		console.log('['+level+'] '+msg);
	}else{	// file
		try{
			var fd , buf = new Buffer(msg);
			if(!fd_cache[path]){
				
				fd = fs.open(path, 'a', '0666', function(){
					fs.write(fd,buf,0,buf.size(),null);
				});
			}else{
				fd = d_cache[path];
				fs.write(fd,buf,0,buf.size(),null);
			}
		}catch(e){
			// 
		}
	}
}
