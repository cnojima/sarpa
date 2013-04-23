$(function() {
	/**
	 * Renders standard nav-menu for a given category
	 * @param {String} catId - empty string for root categories
	 */
	function _renderCategoryList(catId) {
		function success(raw, status, xhr) {
			$('#categories').html(Handlebars.compile(SM.templates['category/menu.html'])({
				categories : raw
			}));
		};
	
		$.ajax({
			url : '/rest/shop/' + catId,
			success	: success,
			error : SM.handleAsyncError
		});
	}
	
	/**
	 * Renders a single product detail view
	 * @param {String} "/rest/products?pageSize=60&currentPage=1&sortBy=-1&catId=cat60103"
	 */
	function _renderProductGrid(url) {
		function success(raw, status, xhr) {
			$('#categories').html(Handlebars.compile(SM.templates['search/grid.html'])({
				products : raw
			}));
		}

		$.ajax({
			url : url,
			success	: success,
			error : SM.handleAsyncError
		});
	}
	
	SM.category = (function() {
		/**
		 * bootstrap
		 */
		$('ul.navigation').live('click', function(e) {
			var restUrl, success, catId, href, li = $(e.target);
			href = li.data('href').split('/');
			catId = href.pop();
			
			if(catId.substr(0, 8) == 'products') {
				var api = catId, catId = href.pop();
				history.pushState({}, e.target.innerText, '/shop/' + catId + '/' + api);
				
				_renderProductGrid([ '/rest/' , api , '&catId=' , catId ].join(''));
			} else {
				history.pushState({
					"catId" : catId
				}, e.target.innerText, '/shop/' + catId);
				
				_renderCategoryList(catId);
			}
		});
		
		return {
			renderCategoryList			: _renderCategoryList,
			renderProductGrid			: _renderProductGrid
		}
	})()
});