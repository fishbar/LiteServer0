/**
 * extends this mime-type list when your application need 
 * here is just a common list
 */
var MIME = {
	'*' 	: 'application/octet-stream',
	'asf' 	: 'video/x-ms-asf',
	'avi' 	: 'video/x-msvideo',
	'bmp' 	: 'image/bmp',
	'css' 	: 'text/css',
	'dir' 	: 'application/x-director',
	'dll' 	: 'application/x-msdownload',
	'doc' 	: 'application/msword',
	'docx' 	: 'application/msword',
	'exe' 	: 'application/octet-stream',
	'gif' 	: 'image/gif',
	'gz' 	: 'application/x-gzip',
	'h' 	: 'text/plain',
	'htm' 	: 'text/html',
	'html' 	: 'text/html',
	'jpe' 	: 'image/jpeg',
	'jpeg' 	: 'image/jpeg',
	'jpg' 	: 'image/jpeg',
	'js' 	: 'text/javascript',
	'mid' 	: 'audio/mid',
	'mov' 	: 'video/quicktime',
	'mp3' 	: 'audio/mpeg',
	'mpe' 	: 'video/mpeg',
	'mpeg' 	: 'video/mpeg',
	'mpg' 	: 'video/mpeg',
	'pdf' 	: 'application/pdf',
	'pps' 	: 'application/vnd.ms-powerpoint',
	'ppt' 	: 'application/vnd.ms-powerpoint',
	'qt' 	: 'video/quicktime',
	'rtf' 	: 'application/rtf',
	'sh' 	: 'application/x-sh',
	'swf' 	: 'application/x-shockwave-flash',
	'tar' 	: 'application/x-tar',
	'tgz' 	: 'application/x-compressed',
	'tif' 	: 'image/tiff',
	'tiff' 	: 'image/tiff',
	'txt' 	: 'text/plain',
	'wav' 	: 'audio/x-wav',
	'wps' 	: 'application/vnd.ms-works',
	'xbm' 	: 'image/x-xbitmap',
	'zip' 	: 'application/zip'
	//Extends when you needed
};
/** gzip controller  **/
var GZIP = {
	'html' : true,
	'htm' : true,
	'txt' 	: true,
	'js' 	: true,
	'css' 	: true,
};
/**
 * cache expires by mime-type, unit : second
 */
var T_HOUR = 3600;
var T_DAY = 3600 * 24;
var T_WEEK = 3600 * 24 * 7;
var T_MONTH = 3600 * 24 * 30;
var T_YEAR = 3600 * 24 * 365;
var mime_cache = {
	'bmp' : T_YEAR,
	'css' 	: T_YEAR,
	'gif' 	: T_YEAR,
	'htm' 	: T_YEAR,
	'html' 	: T_YEAR,
	'jpe' 	: T_YEAR,
	'jpeg' 	: T_YEAR,
	'jpg' 	: T_YEAR,
	'js' 	: T_YEAR,
	'swf' 	: T_YEAR,
	'txt' 	: T_YEAR,
};

/**
 * @param {String} suffix suffix with LowerCase
 */
exports.getType = function(suffix){
	var mime = MIME[suffix];
	return mime ? mime : MIME['*'];
}
exports.needGzip = function(suffix){
	return GZIP[suffix];
}
exports.getExpire = function(suffix){
	return mime_cache[suffix];
}
