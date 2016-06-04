'use strict';

const dotenv = require('dotenv');

if ((process.env.NODE_ENV || 'development') === 'development') {
  // load the applications environment
  dotenv.load();
}
