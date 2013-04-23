
module.exports = function(req, res) {
	var url = require('url'),
		controller, args,
		api = require('../libs/rest.js'),
		db = global.app.get('db');

	var parsedUrl = url.parse(req.url, true),
		restPath = parsedUrl.pathname.split('/');

	/* parsedUrl sample
{
  search: '?pageSize=60&currentPage=1&sortBy=-1&catId=cat60087',
  query: 
   { pageSize: '60',
     currentPage: '1',
     sortBy: '-1',
     catId: 'cat60087' },
  pathname: '/rest/products',
  path: '/rest/products?pageSize=60&currentPage=1&sortBy=-1&catId=cat60087',
  href: '/rest/products?pageSize=60&currentPage=1&sortBy=-1&catId=cat60087'
}
	*/
	
	
	
	function deHtmlEntitize(o) {
		for(var k in o) {
			if(o.hasOwnProperty[k]) {
				if(typeof o[k] == 'string') {
					o[k] = o[k].replace('&amp;', '&');
				} else if(typeof o[k] == 'object') {
					o[k] = deHtmlEntitize(o[k]);
				}
			}
		}
		
		return o;
	}
	
	
	
	/**
	 * Callbacks
	 */
	function deliverCategoryProducts(raw) {
		res.send(raw.products);
	}
	function deliverProduct(raw) {
		raw = deHtmlEntitize(raw);
		res.send(raw);
	}








	if(restPath.length > 2) {		
		controller = restPath[2];
		
		switch(controller) {
			case 'my':
				var action = restPath[3];
				switch(action) {
					case 'basket':
						db.collection('shoppingBasket', {}, function(err, collection) {
							var basket = JSON.parse(parsedUrl.query.payload);
							
							if(basket.length < 1) basket = null;

							if(basket === null) {
								// delete basket
								collection.remove({ sessionId : req.cookies['connect.sess'] });
							} else { 
								collection.find({ sessionId : req.cookies['connect.sess'] }).count(function(err, c) {
									if(c < 1) {
										// create basket
										collection.insert({
											sessionId : req.cookies['connect.sess'],
											basket : basket
										});
									} else {
										// update basket
										collection.update({
											sessionId : req.cookies['connect.sess']
										}, {
											sessionId : req.cookies['connect.sess'],
											basket : basket
										});
									}
								});
								
							}
						});
						res.send('done');
					break;
				}
			
			break;
		
			case 'product':
				if(restPath[3] != '') {
					api.rest_getProduct('/services/product/' + restPath[3], deliverProduct);
				} else {
					throw new Error('cannot fetch product without rest url');
				}
			break;
			
			case 'products':
				if(typeof parsedUrl.query.catId != 'undefined') {
					api.rest_getCategoryProducts(parsedUrl.query.catId, parsedUrl.query, deliverCategoryProducts);
				} else {
					throw new Error('no category id was passed in arguments set');
				}
			break;
		
			case 'shop':
				catId = restPath.pop();
				
				db.collection('categoryMetadata').find({
					parentCategoryId : catId
				}).toArray(function(err, a) {
					if(!err) {
						res.send(a);
					} else {
						throw new Error(err);
					}
				});
			break;
			
			case 'hbs':
				var fs = require('fs'), 
					ret = ['<html><body><script>/*'],
					paths = parsedUrl.query.templates.split(','),
					cleansedPath, templateStr, hash = {};
					
				for(var i=0, n=paths.length; i<n; i++) {
					cleansedPath = paths[i].replace(/\.\./gim, 'zzzzzzz');
					templateStr = fs.readFileSync('./views/' + cleansedPath).toString();
					templateStr = templateStr.replace(/\t/gim, '').replace(/\n/gim, '');
					
					hash[cleansedPath] = templateStr;
				}
				
				ret.push('var hbsTemplates = ' + JSON.stringify(hash));
				ret.push('*/</script></body></html>');	
				res.set({
					'Content-type' : 'text/html',
					'Cache-Control' : 'public, max-age=3600'
				});
				 
				res.send(ret.join(''));
			break;
		}
		
	
	} else {
		throw new Error('REST path must contain proper arguments.  Received [ ' + req.url + ' ]');
		return null;
	}
};