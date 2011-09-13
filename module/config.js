var cfg;
exports.initConfig = function(root){
	cfg = require('../config.js');
	cfg = cfg.data;
	// default cfg
	/* ================================== */
	if(!cfg.listen){
		cfg.listen = {http:80}
	}
	if(!cfg.root){
		cfg.documentroot = root+'/wwwroot';
	}
	cfg.hosts["*"] = {
		root:cfg.documentroot,
		charset:cfg.charset,
		servername:'',
		index:'index.html',
		router:{}
	};
	
	if(cfg.hosts){
		for(var i in cfg.hosts){
			exports.loadHostRouter(cfg.hosts[i],i);
		}
	}
	
	return cfg;
}
/**
 * load customer router config
 */
exports.loadHostRouter = function(tmp_host,hostdomain){
	var tmp_router;
	// set host default page
	if(!tmp_host.index) tmp_host.index = 'index.html';
	if(!tmp_host.servername && hostdomain) tmp_host.servername = hostdomain;
	// set host default root
	if(!tmp_host.root) tmp_host.root = cfg.documentroot;
	try{
		var routerPath = tmp_host.root+'/router.js';
		if(require.cache[require.resolve(routerPath)]) delete require.cache[require.resolve(routerPath)];
		tmp_router = require(routerPath).router;
		for(var n in tmp_router){
			if(!tmp_host.router[n]){
				tmp_host.router[n] = tmp_router[n];
				continue;
			}
			for(var m in tmp_router[n]){
				tmp_host.router[n][m] = tmp_router[n][m];
			}
		}
	}catch(e){
		console.log('[INFO]host:'+tmp_host.servername+' : no router rule!');
	}
	return tmp_host;
}
