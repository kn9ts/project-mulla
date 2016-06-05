'use strict';

require('./environment');
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./server/routes');
const genTransactionPassword = require('./server/utils/genTransactionPassword');
const apiVersion = process.env.API_VERSION;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// trust proxy if it's being served in GoogleAppEngine
if ('GAE_APPENGINE_HOSTNAME' in process.env) app.set('trust_proxy', 1);

// Uncomment this for Morgan to intercept all Error instantiations
// For now, they churned out via a JSON response
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// not using express less
// app.use(require('less-middleware')(path.join(__dirname, 'server/public')));
app.use(express.static(path.join(__dirname, './server/public')));

// memory based session
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true,
}));

// on payment transaction requests,
// generate and password to req object
app.use(`/api/v${apiVersion}/payment*`, genTransactionPassword);

// get an instance of the router for api routes
const apiRouter = express.Router;
app.use(`/api/v${apiVersion}`, routes(apiRouter()));

// catch 404 and forward to error handler
app.use((req, res) => {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(err.status).json({
    status: err.status,
    request_url: req.originalUrl,
    message: err.message,
    stack_trace: err.stack.split(/\n/).map(stackTrace => stackTrace.replace(/\s{2,}/g, ' ').trim()),
  });
});

// error handlers
app.use((err, req, res) => {
  console.log('ERROR PASSING THROUGH', err.message);
  // get the error stack
  const stack = err.stack.split(/\n/)
    .map(stackTrace => stackTrace.replace(/\s{2,}/g, ' ').trim());

  // send out the error as json
  res.status(err.status || 500).json({
    api: err,
    url: req.originalUrl,
    error: err.message,
    stack,
  });
});

const server = app.listen(process.env.PORT || 8080, () => {
  console.log('Express server listening on %d, in %s' +
    ' mode', server.address().port, app.get('env'));
});

// expose app
module.exports = app;
