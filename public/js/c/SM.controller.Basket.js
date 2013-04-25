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
	 * buttons
	 */
	$('.btn-add-to-basket').live('click', function(e) {
		SM.search.getFocusProduct(basket.addItem);
		alert('item added to basket - think fancy overlay or something');
	});
	
	$(window).bind('basketUpdated', updateBasketCount);

	return {
		getBasketCount	: getBasketCount,
		getBasketItems : getBasketItems,
		updateBasketCount			: updateBasketCount
	}
})();