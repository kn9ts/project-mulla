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
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'jade');

// trust proxy if it's being served in GoogleAppEngine
if ('GAE_APPENGINE_HOSTNAME' in process.env) app.set('trust_proxy', 1);

// Uncomment this for Morgan to intercept all Error instantiations
// For now, they churned out via a JSON response
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
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
const router = express.Router(); // eslint-disable-line new-cap
app.use(`/api/v${apiVersion}`, routes(router));

app.all('/*', (req, res) => {
  res.render('index', { title: 'Project Mulla' });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  next(err);
});

// error handlers
app.use((err, req, res, next) => {
  if (typeof err === 'undefined') next();
  console.error('An error occured: ', err.message); // eslint-disable-line no-console
  const errorResponse = {
    status_code: err.statusCode,
    request_url: req.originalUrl,
    message: err.message,
  };

  // use this prettify the error stack string into an array of stack traces
  const prettifyStackTrace = stackTrace => stackTrace.replace(/\s{2,}/g, ' ').trim();

  // Only send back the error stack if it's on development mode
  if (process.env.NODE_ENV === 'development') {
    const stack = err.stack.split(/\n/).map(prettifyStackTrace);
    errorResponse.stack_trace = stack;
  }

  return res.status(err.statusCode || 500).json();
});

const server = app.listen(process.env.PORT || 8080, () => {
  console.log('Your secret session key is: ' + process.env.SESSION_SECRET_KEY); // eslint-disable-line no-console
  console.log('Express server listening on %d, in %s mode', server.address().port, app.get('env')); // eslint-disable-line no-console
});

// expose app
module.exports = app;
