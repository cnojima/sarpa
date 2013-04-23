var c = require('./config.js'),
	mongodb = require('mongodb'),
	mongoserver = new mongodb.Server(c.mongoHost, c.mongoPort, c.mongoServerOptions),
	db_connector = new mongodb.Db('sarpa', mongoserver, c.mongoDbOptions);

module.exports = db_connector;