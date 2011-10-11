// get config
var CFG = require('./module/config');
var LOG = require('./module/log');
var FS = require('fs');

var start_time = new Date();

var cfg = CFG.initConfig(__dirname);
//start server
var server = require('./module/server');
server.init(cfg);
var end_time = new Date();
LOG.info('server start in '+ (end_time.getTime() - start_time.getTime())/1000 + ' second!');
