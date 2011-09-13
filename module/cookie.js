/**
 * Class Cookie
 */
function Cookie(cstr){
	var tmp,len,i;
	/**
	 * instance request cookie
	 */
	this._ck_req = {};
	/**
	 * instance response cookie
	 */
	this._ck_res = {};
	if(cstr){
		cstr = cstr.split(';');
		len = cstr.length;
		for( i = 0 ; i < len ; i++ ){
			tmp = cstr[i].split('=');
			this._ck_req[tmp[0]] = tmp[1];
		}
	}
}
Cookie.prototype = {
	/**
	 * get cookie
	 * @name <String> cookie name
	 * return <String> | undefined
	 */
	get:function(name){
		return this._ck_req[name];
	},
	set:function(name,value,expire,path,domain,httponly){
		var tmp = [];
		if(!name) return;
		tmp.push(name+'='+value);
		if(expire) tmp.push('expire='+expire);
		if(path) tmp.push('path='+path);
		if(domain) tmp.push('domain='+domain);
		if(httponly) tmp.push('secure');
		this.__ck_res[name] = tmp.join(';');
	}
}

exports.Cookie = Cookie;
