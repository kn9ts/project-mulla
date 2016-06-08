'use strict';
const fs = require('fs');
const yaml = require('js-yaml');
const uuid = require('node-uuid');

// default configuration
process.env.API_VERSION = 1;
process.env.ENDPOINT = 'https://safaricom.co.ke/mpesa_online/lnmo_checkout_server.php?wsdl';
process.env.SESSION_SECRET_KEY = uuid.v4();
console.log('Your secret session key is: ' + process.env.SESSION_SECRET_KEY);

// if an env has not been provided, default to development
if (!('NODE_ENV' in process.env)) process.env.NODE_ENV = 'development';

if (process.env.NODE_ENV === 'development') {
  // Get the rest of the config from app.yaml config file
  const config = yaml.safeLoad(fs.readFileSync('app.yaml', 'utf8'));
  Object.keys(config.env_variables).forEach(key => {
    process.env[key] = config.env_variables[key];
  });
}
