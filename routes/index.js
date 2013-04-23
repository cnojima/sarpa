exports.shop = require('./shop.js');
exports.test = require('./test.js');
exports.product = require('./product.js');
exports.my = require('./my.js');

exports.rest = require('./rest.js');


module.exports.index = function(req, res){
	res.render('index', { 
		title			: 'Touch POC',
		isProduction	: global.app.get('env') == 'production',
		mode			: global.app.get('env')
	});
};