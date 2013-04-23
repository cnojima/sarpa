var r = require('../libs/rest.js'),
	dbConn = require('../libs/db.js');

var db, catId = '', meta = [], depth = 0;


dbConn.open(function(err, database) {
	if(err) {
		throw new Error(err);
	} else {
		db = database;
	}
});



// find category and merge metadata
function mergeIn(aCats, catId, newCats) {
	var i,n;
	
	for(i=0, n=aCats.length; i<n; i++) {
		if(aCats[i].categoryId == catId) {
			aCats[i].childCategories = newCats;
			return aCats;
		}
	}
	
	// if it gets this far, we go down the node tree
	for(i=0, n=aCats.length; i<n; i++) {
		if(aCats[i].hasChildCategories && typeof aCats[i].childCategories != 'undefined') {
			aCats[i].childCategories = mergeIn(aCats[i].childCategories, catId, newCats);
		}
	}

	return aCats;
}


function handleGetCategory(a) {
	var i, n, cat, cats, catId;

	if(a.length === 2) {

		cats = a[0];
		catId = a[1];
		
		if(meta.length === 0) {
			meta = cats;
		} else {
			meta = mergeIn(meta, catId, cats);
		}
	
		for(i=0, n=cats.length; i<n; i++) {
			cat = cats[i];

			if(cat.hasChildCategories) {
				console.log('--- category [ ' + cat.displayName + ' -- ' + cat.categoryId + ' ] has child cats');
				depth++;
				r.rest_getChildCategories(cat.categoryId, handleGetCategory);
			}
		}

		if(depth === 0) {
			process.emit('categoryLoaded');
/*
			console.log('*******************************************************');
			console.log('*******************************************************');
			console.log(meta);
			console.log('*******************************************************');
			console.log('*******************************************************');
*/
		}

		depth--;

	} else {
		console.log('ERROR: @handleGetCategory - no metadata returned');
	}
}

process.once('categoryLoaded', function(a,b,c) {
//console.log(db);

	db.collectionNames(function(err, colls) {
		console.log(colls);
	});
	
	db.createCollection('categoryMetadata', function(err, collection) {
		console.log('inserting collection');
		collection.insert(meta, function(err) {
			console.log('insert complete');
			process.exit();
		});
	});
});


r.rest_getChildCategories('', handleGetCategory);

