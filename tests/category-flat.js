var r = require('../libs/rest.js'),
	dbConn = require('../libs/db.js');

var db, catCollection, catId = '', depth = 0;


dbConn.open(function(err, database) {
	if(err) {
		throw new Error(err);
	} else {
		db = database;
		console.log('dropping collection');
		db.dropCollection('categoryMetadata', function(err) {
			db.collection('categoryMetadata', {}, function(err, collection) {
				catCollection = collection;
				process.emit('collectionReady');
			});
		});
	}
});

function handleGetCategory(a) {
	var i, n, cat, cats, catId;

	if(a.length === 2) {

		cats = a[0];
		catId = a[1];
		
	
		for(i=0, n=cats.length; i<n; i++) {
			cat = cats[i];
			
			catCollection.insert(cat);
			console.log('.');

			if(cat.hasChildCategories) {
				console.log('--- category [ ' + cat.displayName + ' -- ' + cat.categoryId + ' ] has child cats');
				depth++;
				r.rest_getChildCategories(cat.categoryId, handleGetCategory);
			}
		}

		if(depth === 0) {
			process.emit('categoryLoaded');
		}
		depth--;
	} else {
		console.log('ERROR: @handleGetCategory - no metadata returned');
	}
}


process.once('collectionReady', function() {
	r.rest_getChildCategories('', handleGetCategory);
});

process.once('categoryLoaded', function() {
	db.close();
	process.exit('done');
});