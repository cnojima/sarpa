module.exports = function(req, res) {
	var db = global.app.get('db'),
		url = require('url'),
		fs = require('fs'),
		hbs = require('../libs/sHandlebars.js'),
		api = require('../libs/rest.js');
	
	
	/**
	 * totals up a basket
	 */
	function _getTotalFromBasket(a) {
		var total = 0.0, ret = '';
		
		a.forEach(function(el) {
			total += parseFloat(el.listPrice.replace('$', ''));
		});
		
		ret = new String(total);
		
		if(ret.indexOf('.') > -1) {
			var exRet = ret.split('.');
			
			if(exRet[1].length < 2) {
				exRet[1] = exRet[1] + '0';
			} else if(exRet[1].length > 2) {
				exRet[1] = exRet[1].substr(0, 2);
			}
			
			ret = exRet[0] + '.' + exRet[1];
		} else {
			ret += '.00';
		}
		
		ret = '$' + ret;
		
		console.log('basket total [ ' + total + ' ] --- [ ' + ret +  ' ]');
		return ret;
	}
	
	
	function _collectSkus(cb) {
		db.collection('shoppingBasket').find({
			sessionId : req.cookies['connect.sess']
		}).toArray(function(err, a) {
			var basket = a[0].basket;
			
			api.rest_getSkus(basket, function(basketContents) {
				console.log('@rest_getSkus callback');
				
				var basket = {
					contents : basketContents,
					total : _getTotalFromBasket(basketContents)
				};
				
				cb(basket);
			});
		});
	
	}


	var action = (req.params.action) ? req.params.action : 'account',
		parsedUrl = url.parse(req.url, true),
		restPath = parsedUrl.pathname.split('/');


	switch(action) {
		case 'confirmation':
			res.render('checkout/confirmation', {
				title			: 'Order Confirmation',
				isProduction	: global.app.get('env') == 'production',
				mode			: global.app.get('env')
			});
		break;

		case 'basket':
			_collectSkus(function(basket) {
				res.render('my/basket', { 
					title			: 'My Basket',
					isProduction	: global.app.get('env') == 'production',
					mode			: global.app.get('env'),
					basket			: basket
				});
			});
		break;
		
		case 'review':
			_collectSkus(function(basket) {
				res.render('my/review', { 
					title			: 'My Basket',
					isProduction	: global.app.get('env') == 'production',
					mode			: global.app.get('env'),
					basket			: basket
				});
			});
		break;
		
		default: 
			res.render('my/' + action, { 
				title			: 'My',
				isProduction	: global.app.get('env') == 'production',
				mode			: global.app.get('env')
			});
		break;
	}
};