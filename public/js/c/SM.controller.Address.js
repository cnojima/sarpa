SM.namespace('SM.controller.Address');
SM.controller.Address = (function() {
	var toEditFlag = false,
		inEditMode = false;

	function toggleGoToEdit(e) {
		if(toEditFlag) { // exiting edit mode
			$('.address-section-title').text('Ship To');
			$('.edit-addresses-button').show();
			$('.add-address-section').show();
		} else {
			$('.address-section-title').text('Edit Ship To');
			$('.edit-addresses-button').hide();
			$('.add-address-section').hide();
		}
		toEditFlag = !toEditFlag;
	}


	/**
	 * bootstrap
	 */
	// go to address screen from review screen click on ship-to or delivery address fields
	$('#ship_to, #delivery').on('click', function(e) {
		window.location = '/my/address';
	});

	// click 'cancel' button to go back to review screen
	$('.cancel-button').on('click', function(e) {
		if(toEditFlag) {
			toggleGoToEdit(e);
		} else {
			window.location = '/my/review';
		}
	});

	// done editing
	$('.done-addresses-button').on('click', function(e) {
		window.location = '/my/address';
	});

	// go to edit view of an address
	$('section.address-section').on('click', function(e) {
		if(toEditFlag) {
			window.location = '/my/address?subaction=edit';
		} else {
			window.location = '/my/review';
		}
	});

	// click "+" add address section
	$('.add-address').on('click', function(e) {
		window.location = '/my/address?subaction=edit';
	});

	// toggles "Edit" mode in address choice screen
	$('.edit-addresses-button').on('click', toggleGoToEdit);
})();
