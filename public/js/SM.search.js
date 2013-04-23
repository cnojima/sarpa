SM.namespace('SM.search')
SM.search = (function() {
	var focusProduct;
	
	/**
	 * Gets the focus product
	 * @param {Function} callback
	 */
	function getFocusProduct(callback) {
		var amount = parseInt($('#productQuantity').val());
		
		if(!focusProduct) {
			var pId = window.location.pathname.split('/');
			
			if(pId[1] == 'product') {
				$.ajax({
					url : '/rest/product/' + pId[2],
					success : function(res) {
						focusProduct = res;
						callback(res, amount);
					},
					error : SM.handleAsyncError
				});
			}
		} else {
			callback(focusProduct, amount);
		}
	}
	/**
	 * sets the focus product
	 * @param {Object} product Product metadata
	 */
	function setFocusProduct(product) {
		focusProduct = product;
	}
	
	function _renderProductDetail(res) {
		var t = Handlebars.compile(SM.templates['common/productDetail.html']);
		 //res.mainHeroImage = res.currentSku.heroImages[0];
		
		setFocusProduct(res);
		
		res = SM.deHtmlEntitize(res);
		var html = t(res);
		$('#mobileContent').html(html);
	}

	$('.product-wrapper > a').live('click', function(e) {
		var href = $(this).data('href'),
			ex = href.split('?'),
			exPath = ex[0].split('/');
		
		
		
		$.ajax({
			url : '/rest/product/' + exPath.pop() + '?' + ex[1],
			success : function(res) {
				if(res.errorMessages && res.errorMessages.length > 0) {
					alert(res.errorMessages[0]);
				} else {
				
					history.pushState({
						product : res
					}, res.currentSku.displayName, '/product/' + res.productId);
				
					_renderProductDetail(res);
				}
			},
			error : SM.handleAsyncError
		});
	});
	
	return {
		getFocusProduct				: getFocusProduct,
		renderProductDetail			: _renderProductDetail
	};
})();