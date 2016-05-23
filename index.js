'use strict';

require('./environment');
let express = require('express');
let app = express();
let path = require('path');
let config = require('./server/config')(process.env.NODE_ENV);
// let favicon = require('serve-favicon');
let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let routes = require('./server/routes');
let genTransactionPassword = require('./server/utils/genTransactionPassword');
let apiVersion = process.env.API_VERSION;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Uncomment this for Morgan to intercept all Error instantiations
// For now, they churned out via a JSON response
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// not using express less
// app.use(require('less-middleware')(path.join(__dirname, 'server/public')));
app.use(express.static(path.join(__dirname, './server/public')));

// memory based session
app.use(session({
  secret: config.expressSessionKey,
  resave: false,
  saveUninitialized: true,
}));

// on payment transaction requests,
// generate and password to req object
app.use(`/api/v${apiVersion}/payment*`, genTransactionPassword);

// get an instance of the router for api routes
app.use(`/api/v${apiVersion}`, routes(express.Router()));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.request = req.originalUrl;
  err.status = 404;
  next(err);
});

// error handlers
app.use((err, req, res) => {
  res.status(err.status || 500);
  // get the error stack
  let stack = err.stack.split(/\n/).map((err) => {
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

var server = app.listen(process.env.PORT || 3000, () => {
  console.log('Express server listening on %d, in %s' +
    ' mode', server.address().port, app.get('env'));
});

// expose app
exports.default = app;
