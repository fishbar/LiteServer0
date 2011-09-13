exports.data = {
	debug:true,
	listen:{
		http:80,
		//https:433,
	},
	documentroot:'',
	serverroot:__dirname,
	charset:'utf8',

	errlog:'error.log',
	errformat:'%%',
	
	page404:'',
	hosts:{
		'1.test.com':
		{
			root:'d:/wwwroot',	// end without '/'
			charset:'utf8',
			servername:'1.test.com',
			index:'index.html',
			errlog:'error.log',
			router:{
				
			},
			rewrite:{
				'/(\w+)$'	: ['m','control/$1.js']
			}
		},
		'2.test.com':
		{
			root:'d:/wwwroot/Documentation',
			charset:'utf8',
			servername:'2.test.com',
			index:'index.html',
			errlog:'error.log',
			router:{
				// dynamic model router , server will treat it as a node model
				model:{
					//'/index'	:'/test.js'
				},
				// static path router , server will treat it as a path
				path:{
					
				}
			}
		}
	}
}
