/**
 *  define model public functions
 */
exports.init = function(cfg,cb){
	debug = cfg.debug;
	//init load models
	for(var i in cfg.listen){
		Server.init(i,cfg,cb);
	}
};
/**
 * define private property 
 */
var debug = false;
var LOG = require('./log');
var FS = require('fs');
var CFG = require('./config');
var ZLIB = require('zlib');
var EXCEPTION =require('./exception');
var Stream = require('stream');
var Cookie = require('./cookie').Cookie;
var parseGET = require('./get').parseGET;
var parsePOST = require('./post').parsePOST;
var Server = {
	model:{},
	staticModel:{},
	serv:{},
	preload:function(){},
	init:function(i,cfg,cb){
		var mod  = require(i);
		var port = cfg.listen[i];
		var hosts = cfg.hosts;
		var serv = mod.createServer(this.handler(hosts));
		
		// extends response Object 
		if(i == 'http'){
			// res.response();
			mod.ServerResponse.prototype.response = function(body,statu_code){
				var res_header = {'x-power' : 'LiteServer(NodeJS)'};
				if(!statu_code) statu_code=200;
				// gzip
				var gzip = this.getHeader('content-encoding');
				switch (gzip) {
				    // or, just use zlib.createUnzip() to handle both cases
				    case 'gzip':
				    	gzip = ZLIB.createGzip();
				    	break;
				    case 'deflate':
				    	gzip = ZLIB.createDeflate();
				    	break;
				    default:
				    	gzip = null;
				      	break;
				  }
				  
				// cache controll
				if(body.pipe){
					res_header['transfer-encoding'] = 'chunked';
					this.writeHead(statu_code,res_header);
					if(gzip)
						body.pipe(gzip).pipe(this);
                    else
						body.pipe(this);
				}else{
					if(body)res_header['content-length'] = body.length;	
					this.writeHead(statu_code,res_header);
					this.write(body,this.charset);
					this.end();
				}
			};
			// res.responseJson();
			mod.ServerResponse.prototype.responseJson = function(body,statu_code){
				
			};
		}
		LOG.info(i + ' server listen port : '+port);
		serv.on('error',function(error){
			var msg = {
				'EADDRINUSE':'server port allready in use ,please point to another one!',
			}
			LOG.error(msg[error.code]);
		});
		serv.listen(port,function(args){
			if(cb)cb();
		});
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
			//access log
			LOG.access(path);
			
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
				LOG.warn('can not load controller:'+controller);
				res.response('<h1>404 Not Found</h1>',404);
				res.end();
				return;
			}
			//try{
				if(req.method === 'GET'){
					controllerMod.run(req,res,get,{},cookie);
				}else if(req.method === "POST"){
					boundary = getBoundary(header['content-type']);
					parsePOST(req,boundary,function(post){
						//prepare GET,POST,REQ,RES,COOKIE,LOG,SESSION
						controllerMod.run(req,res,get,post,cookie);
					});
				}
				/*
			}catch(e){
				LOG.error('controller execute error:'+controller);
				res.response('<h1>500 Server Error</h1>',500);
				if(debug){
					LOG.error(e);
				}
				res.end();
				return;
			}
			*/
		}
	}
};
/* router request return [type , path]*/
function xRouter(rules,path){
	if(!rules || (!rules.model && !rules.path)){
		LOG.rewrite('apply<path>:'+path);
		return ['p',path];
	}else if(rules.model[path]){
		LOG.rewrite('apply<model>:'+path+'=>'+rules.model[path]);
		return ['m',rules.model[path]];
	}else if(rules.path[path]){
		LOG.rewrite('apply<path>:'+path+'=>'+rules.path[path]);
		return ['p',rules.path[path]];
	}
	var n,rule,i,j,j_o;
	for(j in rules){
		j_o = j;
		j = j=='model' ? 'm' : 'p';
		rule = rules[j];
		for(i in rule){
			if(i.indexOf('~') === 0){ // 正则匹配 match
				n = i.substring(1);
				if(new RegExp(n).test(path)){
					if(typeof rule[i] == 'string'){
						LOG.rewrite('apply<'+j_o+'>:'+path+'=>'+rules.path[path]);
						return [j,rule[i]];
					}else{
						//TODO impletement apache rewrite rule [P,L,NC] if need,now is empty
					}
				}
			}
		}
	}
	LOG.rewrite('apply<path>:none,using original path');
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
