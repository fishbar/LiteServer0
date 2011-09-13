var EXCEPTION =require('./exception');

exports.parsePOST = function(req,boundary,cb){
	/**
------WebKitFormBoundaryw8eD2rLvEQhJ6eJq
Content-Disposition: form-data; name="file"; filename="627650.mp3"
Content-Type: audio/mp3

------WebKitFormBoundaryw8eD2rLvEQhJ6eJq
Content-Disposition: form-data; name="name"

fish
------WebKitFormBoundaryw8eD2rLvEQhJ6eJq--
	 */
	var post = {},
		buf_name = null,
		buf_fname = null,
		count = 0,
		buf_str = '',
		offset,offset_buf = -1,
		len,	
		line,
		touchbody = false;
	if(boundary){
		boundary = '--'+boundary;
		len = boundary.length+2;/* exclude \r\n */
	}
	req.addListener('data',function(chunk){
		// form-url-encode
		if(!boundary){
			buf_str += chunk;
			return ;
		}
		// multi-part post
		// handle the situation when boundary is separated
		chunk = buf_str + chunk;
		while( (offset = chunk.indexOf(boundary)) !== -1){
			if( offset !== -1){
				if(buf_name){
					if(offset)buf_str = chunk.substr(0,offset-2); /** exclude \r\n **/
					if(!touchbody)offset_buf = buf_str.indexOf('\r\n\r\n');
					if(offset_buf !== -1) buf_str = buf_str.substr(offset_buf+2);
					post[buf_name].data = buf_str;
					buf_name = null;
					buf_str = '';
				}
				// cute the boundary
				chunk = chunk.substr(offset+len);
				// get content - disposition
				offset = chunk.indexOf('\r\n');
				if(offset === -1){
					// this chunk is over
					touchbody = false;
					break;
				}
				line = chunk.substr(0,offset).split('; ');
				if(line.length <= 1 || line[0].toLowerCase().indexOf('content-disposition:') !== 0){
					//throw new EXCEPTION.PostException('PostMultiPart:Content-Disposition is missing or format is wrong!');
					break;
				}
				// get field name
				if(line[1].indexOf('name=') === 0)
					buf_name = line[1].substr(6,line[1].length-7);
				else if(line[1].indexOf('filename=') === 0 ){
					buf_fname = line[1].substr(10,line[1].length - 11);
				}
				if(line[2]){
					if(line[2] && line[2].indexOf('name=') === 0)
						buf_name = line[2].substr(6,line[2].length-7);
					else if(line[2] && line[2].indexOf('filename=') === 0)
						buf_fname = line[2].substr(10,line[2].length - 11);
				}
				if(!buf_name) {
					buf_name = 'upfile'+count;
					count ++;
				}
				post[buf_name] = {data:''};
				if(buf_fname)post[buf_name].filename = buf_fname;
				buf_fname = null;
				offset = chunk.indexOf('\r\n\r\n');
				if(offset !== -1){
					chunk = chunk.substr(offset + 4);
					touchbody = true;
				}else{
					touchbody = false;
				}
			}
		}
		//buffer the rest chunk;
		buf_str = chunk;
	});
	req.addListener('end',function(){
		if(!boundary){
				post = parsePostStr(buf_str);
		}
		// release tmp vars
		buf_name = buf_fname = buf_str = count = offset = offset_buf = len = line = null;
		cb(post);
	});
};

function parsePostStr(cstr){
	// form url encode is different
	var tmp,len,i,pm = {};
	/**
	 * see RFC1738 , it is different with urldecode 
	 */
	cstr = cstr.replace(/+/g,' ');
	if(cstr){
		cstr = cstr.split('&');
		len = cstr.length;
		for( i = 0 ; i < len ; i++ ){
			tmp = cstr[i].split('=');
			pm[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]);
		}
	}
	return pm;
}