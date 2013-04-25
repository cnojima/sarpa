SM.namespace('SM.controller.Nav');
SM.controller.Nav = (function() {

	// head basket button	
	$('button.basket').on('click', function(e) {
		window.location = '/my/basket';
	});


	return {};
})()