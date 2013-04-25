require('../libs/Object.js');
require('../libs/Array.js');

var http = require('http'),
	useProxy = false,
	proxyHost = 'localhost',
	proxyPort = '55555',

	// restHost = 'dev.sephora.com',
	restHost = 'qa.sephora.com',
	
	restPort = '80',
	restEndpoint = '/services/',
	restEndpointRoot = ['http://' , restHost , ':' , restPort , restEndpoint ].join(''),
	restTimeout = 5000;

var proxyConfig = {
		method : 'GET',
		hostname : proxyHost,
		port : proxyPort,
		path : restEndpointRoot,
		headers : {
			Host : restHost 
		}
	},
	directConfig = {
		method : 'GET',
		hostname : restHost,
		port : restPort,
		path : restEndpointRoot,
	};


function handleData(res, cb) {
	var dataChunked = '';
	
	function doEnd() {
		cb(dataChunked);
	}
	
	if(res.statusCode == 200) {
		res.on('data', function(data) {
			dataChunked += data.toString();
		}).on('error', function(err) {
			console.log(err);
		}).on('end', doEnd);
	} else {
		console.log(res);
		//throw new Error('server returned error ' + res.statusCode);
		dataChunked = '[]';
		doEnd();
	}
}
	
	
module.exports = {
	/**
	 * fake sign-in
	 */
	rest_fakeSignIn : function(cb) {
		var handleResponse = function(res) {
			function handleEnd(dataChunked) {
				content = JSON.parse(dataChunked);
				cb(content);
			}
			handleData(res, handleEnd);
		}, cfg = {};

		var payload = {
			login				: 'chris.nojima@sephora.com',
			password			: 'Smj0ln1r!a',
			loginForCheckout	: true
		}, pls = JSON.stringify(payload);

		cfg.extend( (useProxy) ? proxyConfig : directConfig );
		cfg.method = 'POST';
		cfg.path += 'profile/login';
		
		cfg.headers = {
			Host : restHost ,
			//'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json',
			'Content-Length': pls.length
		};

		// setup connect for POST
		var req = http.request(cfg, handleResponse);
		req.write(pls);
		req.end();
	},

	/**
	 * retrieves child categories given a category ID.  if none passed, the rootCategories are retrieved
	 * @param {String} catId	Parent category ID
	 * @return {Array} 			2 elements, 0 is the child categories, 1 is the parent catId 
	 */
	rest_getChildCategories : function(catId, callback) {
		var content, cfg = {},
			endpoint = 'category',
			categories = [];

		/**
		 * Handles the request's response - connects event handlers
		 * @param {??} res Response from request
		 */
		var handleResponse = function(res) {
			/**
			 * Data return can be chunked, so handle it after the connection is end()'d
			 */
			function handleEnd(dataChunked) {
				content = JSON.parse(dataChunked);
			
				if(content.rootCategories)
					categories = content.rootCategories;
				else if(content.childCategories)
					categories = content.childCategories;
			
				console.log('--- categories.categories has [ ' + categories.length + ' ] categories');
				
				if(categories.length > 0) {
					for(var i=0, n=categories.length; i<n; i++) {
						categories[i].parentCategoryId = catId;
					}
					
					callback([ categories, catId ]);
				}
			}

			handleData(res, handleEnd);
		}


		// root level category call will be empty
		catId = (catId) ? catId : '';
		console.log('@rest_getChildCategories with catId [ ' + catId + ' ]');
		
		if(catId != '') {
			endpoint += '/' + catId;
		}
		
		cfg.extend( (useProxy) ? proxyConfig : directConfig );
		cfg.path += endpoint;
		
		// make request
		http.request(cfg, handleResponse).end();
	},
	
	
	/**
	 * returns a list of products given a category id
	 * @param {String} catId
	 * @param {Object} filters
	 * @param {Function} callback
	 */
	rest_getCategoryProducts : function rest_getCategoryProducts(catId, filters, callback) {
		var cfg = {},
			endpoint = 'category',
			path = [ endpoint, '/', catId , '/', 'products' ];
		
		function handleProducts(res) {
			/**
			 * Data return can be chunked, so handle it after the connection is end()'d
			 */
			function handleEnd(dataChunked) {
				try {
					content = JSON.parse(dataChunked);
					callback(content);
				} catch(ex) {
					throw new Error(ex);
				}
			}
			
			handleData(res, handleEnd);
		}
		
		for(var k in filters) {
			if(filters.hasOwnProperty(k)) {
				if(path.length == 5) { 
					path.push('?');
				} else {
					path.push('&');
				}
				
				path.push(k);
				path.push('=');
				path.push(filters[k]);
			}
		}
		
		cfg.extend( (useProxy) ? proxyConfig : directConfig );
		cfg.path += path.join('');
//console.log(cfg.path);
		http.request(cfg, handleProducts).end();
	},
	
	
	rest_getProduct : function rest_getProduct(url, cb) {
		var cfg = {};
		cfg.extend( (useProxy) ? proxyConfig : directConfig );

		console.log('@rest_getProduct - using url [ ' + url + ' ]');
		
		cfg.path = url;
		
		function handleProduct(res) {
			
			function handleEnd(dataChunked) {
				cb(JSON.parse(dataChunked));
			}
			
			handleData(res, handleEnd);
		}
		
		http.request(cfg, handleProduct).end();
	},
	
	
	
	/**
	 * Retreives the metadata for a single SKU
	 */
	rest_getSku : function rest_getSku(skuId, cb) {
		console.log('@rest_getSku for [ ' + skuId + ' ]');
		var cfg = {};
		cfg.extend( (useProxy) ? proxyConfig : directConfig );
		
		cfg.path += 'sku/' + skuId;
		
		function handleSku(res) {
			function handleEnd(dataChunked) {
				cb(JSON.parse(dataChunked));
			}
			
			handleData(res, handleEnd);
		}
		
		http.request(cfg, handleSku).end();
	},
	rest_getSkus : function rest_getSkus(a, cb) {
		var ret = [], api = this
			counter = a.length;

		a.forEach(function(el) {
			function gotSku(res) {
				ret.push(res);
				counter--;
			}
			
			api.rest_getSku(el.skuId, gotSku);
		});
		
		var counterWaiter = setInterval(function() {
			if(counter <= 0) {
				clearInterval(counterWaiter);
				cb(ret);
			}
		}, 10);
	},
	
	
	rest_getCategory : function(cat) {
		console.log('@rest_getCategory - using url [ ' + cat.url + ' ]');
		var raw = http.get(cat.url);
		
		return raw;
	}
}