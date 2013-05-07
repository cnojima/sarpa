SM.namespace('SM.controller.Basket');
SM.controller.Basket = (function() {
	var basket = new SM.model.Basket(SM.getUserId());
	
	function getBasketItems() {
		return basket.getContents();
	}
	
	
	function getBasketCount() {
		var count = 0, items = getBasketItems();
		
		for(var k in items) {
			count = count + parseInt(items[k].amount);
		}
		
		return count;
	}
	
	function updateBasketCount() {
		console.log('@updateBasketCount'); 
		$('.header-basket .item-count').html(getBasketCount());
	}


	/**
	 * tells view to render basket
	 */
	function showBasket() {
		// instantiate if not drawn
		if(gel('basket') === null) {
			var t = Handlebars.compile(SM.templates['my/basket.html']);

			contents = [];
			for(var k in basket.getContents()) {
				contents.push(basket.getContents()[k]);
			}

			$(document.body).append(t({
				basket : {
					total : '80080.00',
					contents : contents
				}
			}));
		}


		$('webview').addClass('off-canvas-right-main');
	}


	
	/**
	 * buttons
	 */
	$('.btn-add-to-basket').live('click', function(e) {
		SM.search.getFocusProduct(basket.addItem);
		alert('item added to basket - think fancy overlay or something');
	});
	$('#checkout').on('click', function(e) {
		window.location = '/my/review';
	});
	
	$(window).bind('basketUpdated', updateBasketCount);

	return {
		getBasketCount			: getBasketCount,
		getBasketItems			: getBasketItems,
		showBasket				: showBasket,
		updateBasketCount		: updateBasketCount
	}
})();