module = function(o) {
	var attributes = {
		ownerId			: '',
		firstName		: '',
		lastName		: '',
		streetAddress	: '',
		streetAdresss2	: '',
		zip				: '',
		city			: '',
		state			: '',
		phone 			: '',
		phoneExt 		: '',
		isDefault 		: false
	};

	var collection = 'addresses'

	// hydrate
	if(o) {
		for(var k in o) {
			if(attributes[k]) {
				this.set(k, o[k]);
			}
		}
	}


	this.set = function set(key, value) {
		if(attributes[key] != "undefined") {
			attributes[key] = value;
		}
	}
	this.get = function get(key) {
		if(attributes[key]) {
			return attributes[key];
		}
	}
	this.save = function save(cb) {
		var db = app.get('db');
		db.collection('addresses')
	}
}