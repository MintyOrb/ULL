
/**
 * Module dependencies
 */

var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    http = require('http'),
    path = require('path'),
    database = require('./routes/database'),
    passport = require("passport");


var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);


//database
    //match database query functions
function dataQuery(req, res) {
    var func = database[req.param('query')];
    func(req, res);
}
    //match database create functions
function dataCreate(req, res) {
    var func = database[req.param('create')];
    func(req, res);
}
//handle data queries
app.get('/query/:query', dataQuery);

//handle adding new content
app.post('/create/:create', dataCreate)


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);




/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
