require('./environment');

var express = require('express'),
  app = express(),
  path = require('path'),
  config = require('./server/config')(process.env.NODE_ENV),
  // favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  models = require('./server/models'),
  routes = require('./server/routes');

app.set('superSecret', config.webTokenSecret);
app.set('models', models);

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// not using express less
// app.use(require('less-middleware')(path.join(__dirname, 'server/public')));
app.use(express.static(path.join(__dirname, './public')));
app.use(session({
  secret: config.expressSessionKey,
  maxAge: new Date(Date.now() + 3600000),
  proxy: true,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: models.mongoose.connection
  })
}));

// get an instance of the router for api routes
var api = express.Router();
app.use('/api', routes(api));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.request = req.originalUrl;
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res) {
  res.status(err.status || 500);
  // get the error stack
  var stack = err.stack.split(/\n/).map(function(err) {
    return err.replace(/\s{2,}/g, ' ').trim();
  });
  console.log('ERROR PASSING THROUGH', err.message);
  // send out the error as json
  res.json({
    api: err,
    url: req.originalUrl,
    error: err.message,
    stack: stack
  });
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Express server listening on %d, in %s' +
    ' mode', server.address().port, app.get('env'));
});

//expose app
module.exports = app;
