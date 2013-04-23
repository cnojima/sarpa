SM.namespace('SM.model.Basket');

SM.model.Basket = function(userId) {
	var contents = {};
	
	
	/**
	 * Retreives all the metadata for a given basket
	 * @return {Array}
	 */
	function getContents() {
		return contents;
	}
	
	/**
	 * returns an array of skus
	 * @return {Array}
	 */
	function getSkuList() {
		var ret = [];
		
		for(var k in contents) {
			ret.push({
				skuId : k,
				amount : contents[k].amount
			});
		}
		
		return ret;
	}
	
	/**
	 * Saves basket to localStorage
	 */
	function persistBasket() {
		$.jStorage.set('myBasket', getContents());
		
		$.ajax({
			url : '/rest/my/basket',
			type : 'get',
			//processData : false,
			data : {
				payload : JSON.stringify(getSkuList())
			}
		});
	}
	
	/**
	 * adds items to the basket
	 * @param {Object} item
	 * @param {int} amount
	 */
	function addItem(item, amount) {
		var item = (item.currentSku) ? item.currentSku : item;
			amount = (typeof amount == 'integer') ? amount : 1;
	
		if(contents[item.skuId]) {
			contents[item.skuId].amount += amount;
		} else {
			contents[item.skuId] = {
				amount : amount,
				sku : item
			}
		}
		
		$(window).trigger('basketUpdated');
	}
	
	/**
	 * removes an item from the basket
	 * @param {Object} item
	 */
	function removeItem(item) {
		var skuId = (item.skuId) ? item.skuId : (item.currentSku) ? item.currentSku.skuId : false;
		
		if(skuId in contents) {
			delete(contents[skuId]);
		}
		
		$(window).trigger('basketUpdated');
	}
	


	/***************************************************************************
	 **** 	bootstrap														****
	 ***************************************************************************/
	
	$(window).bind('basketUpdated', persistBasket);
	
	$(function() {
		var x = $.jStorage.get('myBasket');
		
		if(x) {
			contents = x;
			$(window).trigger('basketUpdated');
			//SM.controller.updateBasketCount();
		}
	});

	return {
		addItem			: addItem,
		getContents		: getContents,
		getSkuList		: getSkuList,
		removeItem		: removeItem
	}
}