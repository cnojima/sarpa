/**
 * Module dependencies.
 */

var config = require('./libs/config.js'),
	express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	handlebars = require('./libs/sHandlebars.js'),
	cons = require('consolidate'),
	path = require('path');

var app = express(),
	dbConn = require('./libs/db.js'),
	db;

dbConn.open(function(err, database) {
	if(err) {
		throw new Error(err);
	} else {
		db = database;
		app.set('db', db);
	}
});

function test(err, req, res, next) {
	console.log('here');
	next();
}


app.configure(function(){
	app.engine('html', cons[config.templateEngine]);
	app.set('name', 'SARPA')
	app.set('port', process.env.PORT || 3000);
	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');
	
	app.use(test);
	
	app.use(express.cookieParser());
	app.use(express.cookieSession({ secret : 'sarpa' }));
/*
	app.use(express.session({
		secret : 'chrisrocks',
		cookie : {
			secure : true
		}
	}));
*/
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure(config.mode, function(){
	app.use(express.errorHandler());
});


app.get('/', routes.index);
app.all('/rest/*', routes.rest);
app.get('/shop', routes.shop);
app.get('/shop/:catId*', routes.shop);
app.get('/product/:pId*', routes.product);
app.all('/my/:action', routes.my);
app.all('/checkout/:action', routes.my);

app.get('/test', routes.test);

global.app = app;

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server [ " + app.get('name') + " ] listening on port " + app.get('port'));
});

/*** socket server ***/
/*
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	
	socket.on('my other event', function (data) {
		console.log(data);
	});
});
*/