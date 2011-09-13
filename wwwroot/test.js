exports.run = function(req,res,get,post,log){
	var body = '',statu_code=200,res_header = {'x-power' : 'LiteServer(nodeJS0.54)'};
	body =  'test router';
	if(body)res_header['content-length'] = body.length;
	res.writeHead(statu_code,res_header);
	res.write(body,req.charset);
	res.end();
}
