
module.exports = function(req, res) {
	var db = global.app.get('db'),
		url = require('url'),
		fs = require('fs'),
		hbs = require('../libs/sHandlebars.js'),
		api = require('../libs/rest.js'),
		parentCatId = (req.params.catId) ? req.params.catId : '';

	var parsedUrl = url.parse(req.url, true),
		restPath = parsedUrl.pathname.split('/');

//console.log('catId : ' + parentCatId);console.log(parsedUrl);console.log(restPath);

	db.collection('categoryMetadata').find({
		parentCategoryId : parentCatId
	}).toArray(function(err, a) {
		if(!err) {
			if(restPath.length > 3) {
				api.rest_getCategoryProducts(parentCatId, parsedUrl.query, function(a) {
					res.render('search', { products : a });
				});
			} else {
				if(parentCatId != '') {
					api.rest_getCategoryProducts(parentCatId, {
						pageSize : 4,
						currentPage : 1,
						sortBy : -1
					}, function(productMeta) {
console.log(productMeta);
						res.render('shop', { 
							title			: 'Touch POC',
							isProduction	: global.app.get('env') == 'production',
							mode			: global.app.get('env'),
							categories		: a,
							products		: productMeta.products
						});
					});
				} else {
					res.render('shop', { 
						title			: 'Touch POC',
						isProduction	: global.app.get('env') == 'production',
						mode			: global.app.get('env'),
						categories		: a
					});
				}
			}
		} else {
			throw new Error(err);
		}
	});
};