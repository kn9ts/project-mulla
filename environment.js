var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  // load the applications environment
  require('dotenv').load();
}
