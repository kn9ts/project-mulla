import './environment';
import express from 'express';
import path from 'path';
import configSetUp from './config';
// import favicon from 'serve-favicon';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import models from './models';
import routes from './routes';
import genTransactionPassword from './utils/generatePassword';


const app = express();
const apiVersion = 1;
const config = configSetUp(process.env.NODE_ENV);
const MongoStore = connectMongo(session);

// make the models available everywhere in the app
app.set('models', models);
app.set('webTokenSecret', config.webTokenSecret);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Uncomment this for Morgan to intercept all Error instantiations
// For now, they churned out via a JSON response
app.use(morgan('dev'));
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
export { app as default };
