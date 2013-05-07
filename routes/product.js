module.exports = function(req, res) {
	url = require('url'),
	fs = require('fs'),
	hbs = require('../libs/sHandlebars.js'),
	api = require('../libs/rest.js'),
	productId = (req.params.pId) ? req.params.pId : '';
	
	api.rest_getProduct(productId, function(meta) {

		res.render('product', { 
			title			: 'products',
			isProduction	: global.app.get('env') == 'production',
			mode			: global.app.get('env'),
			product			: meta
		});
	});
};