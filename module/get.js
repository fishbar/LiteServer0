exports.parseGET = function(cstr){
	var tmp,len,i,get = {};
	if(cstr){
		cstr = cstr.split('&');
		len = cstr.length;
		for( i = 0 ; i < len ; i++ ){
			tmp = cstr[i].split('=');
			get[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]);
		}
	}
	return get;
}