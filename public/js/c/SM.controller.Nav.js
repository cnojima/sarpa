SM.namespace('SM.controller.Nav');
SM.controller.Nav = (function() {
	// head basket button
	$('button.basket').on('click', function(e) {
		window.location = '/my/basket';
		//SM.controller.Basket.showBasket();
	});

	$('button.logo').on('click', function(e) {
		window.location = '/';
	})


	return {};
})()