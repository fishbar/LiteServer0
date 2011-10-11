/**
 *  define model public functions
 */
exports.init = function(cfg){
	debug = cfg.debug;
	//init load models
	for(var i in cfg.listen){
		Server.init(i,cfg);
	}
};
/**
 * define private property 
 */
var debug = false;
var LOG = require('./log');
var FS = require('fs');
var CFG = require('./config');
var EXCEPTION =require('./exception');
var Cookie = require('./cookie').Cookie;
var parseGET = require('./get').parseGET;
var parsePOST = require('./post').parsePOST;
var Server = {
	model:{},
	staticModel:{},
	serv:{},
	preload:function(){},
	init:function(i,cfg){
		var mod  = require(i);
		var port = cfg.listen[i];
		var hosts = cfg.hosts;
		var serv = mod.createServer(this.handler(hosts));
		
		if(i == 'http'){
			mod.ServerResponse.prototype.response = function(body,statu_code){
				var res_header = {'x-power' : 'LiteServer(nodeJS0.54)'};
				if(!statu_code) statu_code=200;
				if(body)res_header['content-length'] = body.length;	
				this.writeHead(statu_code,res_header);
				this.write(body,this.charset);
				this.end();
			};
			mod.ServerResponse.prototype.responseJson = function(body,statu_code){
				
			};
		}
		
		serv.listen(port);
		this.serv[i] = serv;
	},
	handler:function(hosts){
		return function(req,res){
			var header = req.headers,
				hostcfg = hosts[header.host.replace(/:\d+$/,'')],
				url = require('url').parse(req.url),
				get,
				path = url.pathname,
				type = '',
				controller,
				controllerMod = null,
				charset,
				boundary,
				boundary_offset,
				cookie,
				mod_real_path;
			if(!hostcfg){	// host not exist
				hostcfg = hosts["*"];
			}
			
			// if debug ,reload router
			if(debug){
				hostcfg = CFG.loadHostRouter(hostcfg);
			}
			
			charset = hostcfg.charset;
			req.setEncoding(charset);
			res.charset = charset;
			
			cookie = new Cookie(header.cookie);
			get = parseGET(url.query);
			
			path = xRouter(hostcfg.router,path);
			type = path[0];
			path = path[1];
			if(path == '/'){
				if(hostcfg.index){
					path += hostcfg.index;
					type = 'p';
				}
			}
			controller = hostcfg.root + path;
			if(type == 'p'){
				req.url = controller;
				controller = './file';
			}
			
			try{
				// delete module cache
				if(debug){	
					mod_real_path = require.resolve(controller);
					if(require.cache[mod_real_path]) delete require.cache[mod_real_path];
				}
				controllerMod = require(controller);
			}catch(e){
				// TODO load model error ,to 404 page
				console.log('[WARNING]can not load controller:'+controller);
				res.response('<h1>404 Not Found</h1>',404);
				res.end();
				return;
			}
			
			try{
				if(req.method === 'GET'){
					controllerMod.run(req,res,get,{},cookie);
				}else if(req.method === "POST"){
					boundary = getBoundary(header['content-type']);
					parsePOST(req,boundary,function(post){
						controllerMod.run(req,res,get,post,cookie);
						//prepare GET,POST,REQ,RES,COOKIE,LOG,SESSION
					});
				}
			}catch(e){
				console.log('[ERROR]controller execute error:'+controller);
				res.response('<h1>500 Server Error</h1>',500);
				res.end();
				return;
			}
			// GC manually
			header = hostcfg = get = post = cookie = controllerMod = null;
		}
	}
};
/* router request return [type , path]*/
function xRouter(rules,path){
	if(!rules || (!rules.model && !rules.path))
		return ['p',path];
	else if(rules.model[path]){
		return ['m',rules.model[path]];
	}else if(rules.path[path]){
		return ['p',rules.path[path]];
	}
	var n,rule;
	for(var j in rules){
		j = j=='model' ? 'm' : 'p';
		rule = rules[j];
		for(var i in rule){
			if(i.indexOf('~') === 0){ // 正则匹配 match
				n = i.substring(1);
				if(new RegExp(n).test(path)){
					if(typeof rule[i] == 'string'){
						return [j,rule[i]];
					}else{
						//TODO impletement apache rewrite rule [P,L,NC] if need,now is empty
					}
				}
			}
		}
	}
	return ['p',path];
}

function getBoundary(ct){
	var tmp = ct.indexOf('boundary=');
	if(tmp !== -1)
		ct = ct.substr(tmp+9);
	else
		ct = '';
	return ct;
}
/** extends res **/
