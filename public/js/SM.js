function gel(id) {
	return document.getElementById(id);
}

var SM = (function() {
	var seed = new Date().getTime();

	function namespace() {
		var i,n,n2,j,ns,root,
			a = arguments;
			
		for(i=0, n=a.length; i<n; i++) {
			ns = a[i].split('.');
			root = SM;
			
			for(j=(ns[0] == "SM" ? 1 : 0), n2=ns.length; j<n2; j++) {
				root[ns[j]] = root[ns[j]] || {};
				root=root[ns[j]];
			}
		}
		return root;
	}
	
	function populateTemplates() {
		var x = frames['hbs_templates'].document.body.childNodes[0].innerHTML;
		x = x.substr(2, x.length - 4);
		eval(x); // provides hbsTemplates hashmap
		templates = hbsTemplates;

		Handlebars.registerPartial('product_grid_api', templates['common/productGrid.html']);
		
		return templates;
	}
	function deHtmlEntitize(o) {
		for(var k in o) {
			if(o.hasOwnProperty[k]) {
				if(typeof o[k] == 'string') {
					o[k] = o[k].replace('&amp;', '&');
				} else if(typeof o[k] == 'object') {
					o[k] = deHtmlEntitize(o[k]);
				}
			}
		}
		
		return o;
	}
	
	
	/**
	 * Generates a GUID for the UI session.
	 * @function
	 * @name	GE.generateGUID
	 * @returns	{String} GUID
	 */
	function generateGUID() {
		return 'SMmx' + new String(seed++);
	}

	/**
	 * returns the current user's id, or a GUID for an unidentified user
	 */
	function getUserId() {
		return generateGUID();
	}
	
	/***************************************************************************
	 **** 	bootstrap														****
	 ***************************************************************************/
	// handle "back" navigations
	window.addEventListener('popstate', function(e) {
		var exPath = window.location.pathname.split('/');	
	 		xId = (exPath[2]) ? exPath[2] : '',
	 		isGrid = (exPath[1] == 'shop' && exPath.length > 3);
	
	 	if(exPath[1] == 'shop' && isGrid) {
	 		SM.category.renderProductGrid('/rest/products' + window.location.search + '&catId=' + xId);
	 	} else if(exPath[1] == 'shop') {
	 		SM.category.renderCategoryList(xId);
	 	} else if(exPath[1] == 'product') {
	 		SM.search.renderProductDetail(e.state.product);
	 	}
	});
	
	/***************************************************************************
	 **** 	bootstrap														****
	 ***************************************************************************/
	
	
	return {
		deHtmlEntitize			: deHtmlEntitize,
		getUserId				: getUserId,
		namespace				: namespace,
		templates				: null,
		templatesLoaded : function() {
			SM.templates = populateTemplates();
		},
		handleAsyncError : function(err) {
			console.error(err);
		}
	};
})();