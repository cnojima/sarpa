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
			if(el.listPrice) {
				total += parseFloat(el.listPrice.replace('$', ''));
			}
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
			if(!err) {
				var basket = a[0].basket;
				
				api.rest_getSkus(basket, function(basketContents) {
					console.log('@rest_getSkus callback');
					
					var basket = {
						contents : basketContents,
						total : _getTotalFromBasket(basketContents)
					};
					
					cb(basket);
				});
			} else {
				console.log(err);
				cb(null);
			}
		});
	
	}


	function _collectAddresses(cb) {
		db.collection('addresses').find({
			
		});

		cb();
	}

	var action = (req.params.action) ? req.params.action : 'account',
		parsedUrl = url.parse(req.url, true),
		restPath = parsedUrl.pathname.split('/');

		console.log('@my - going to [ ' + action + ' ]');

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

		case 'address':
			_collectAddresses(function(addresses) {
				var template = 'my/address';

				if(parsedUrl.query.subaction) {
					template += '/' + parsedUrl.query.subaction;
				}

				res.render(template, {
					title			: 'Addresses',
					isProduction	: global.app.get('env') == 'production',
					mode			: global.app.get('env'),

					selectAddress	: true,

					addressEdit		: parsedUrl.query.subaction == 'edit',

					addresses 		: addresses
				})

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