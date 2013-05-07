module.exports = {
	mode							: (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development',
	templateEngine		: 'handlebars', /* console.log(cons) for full support list */
	
	/*mongoDB */
	mongoHost				: 'localhost',
	mongoPort				: '27017',
	mongoServerOptions		: {
		auto_reconnect		: false, // default false
		poolSize			: 5, // default 5
		socketOptions		: {
			timeout			: 0, // default 0
			noDelay			: true, // default true
			keepAlive		: 0, // default 0
			encoding		: 'utf8' // default null
		}
	},
	mongoDbOptions			: {
		safe				: false
		/* see http://mongodb.github.com/node-mongodb-native/markdown-docs/database.html */
	}
};