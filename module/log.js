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
	var level = 'info';
	writeLog(msg,level);
}
// error 级别的输出
exports.error = function(msg){
	var level = 'error';
	writeLog(msg,level);
}
exports.warn = function(msg){
	var level = 'warn';
	writeLog(msg,level);
}
exports.access = function(msg){
	var level = 'access';
	writeLog(msg,level);
}
exports.rewrite = function(msg){
	var level = 'rewrite';
	writeLog(msg,level);
}

// cache file resource , when server is running , just keep the log file open 
var fd_cache = {};
function writeLog(msg,level){
	path = logcfg[level];
	level = level.toUpperCase();
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
