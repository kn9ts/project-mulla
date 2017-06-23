'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const uuid = require('node-uuid');

const yamlConfigFile = 'app.yaml';

// default configuration
process.env.API_VERSION = 1;
process.env.ENDPOINT = 'https://safaricom.co.ke/mpesa_online/lnmo_checkout_server.php?wsdl';
process.env.SESSION_SECRET_KEY = uuid.v4();

// if an env has not been provided, default to development
if (!('NODE_ENV' in process.env)) process.env.NODE_ENV = 'development';

if (process.env.NODE_ENV === 'development') {
  const requiredEnvVariables = [
    'PAYBILL_NUMBER',
    'PASSKEY',
    'MERCHANT_ENDPOINT',
  ];
  const envKeys = Object.keys(process.env);
  const requiredEnvVariablesExist = requiredEnvVariables
    .every(variable => envKeys.indexOf(variable) !== -1);

  // if the requiredEnvVariables have not been added
  // maybe by GAE or Heroku ENV settings
  if (!requiredEnvVariablesExist) {
    if (fs.existsSync(yamlConfigFile)) {
      // Get the rest of the config from app.yaml config file
      const config = yaml.safeLoad(fs.readFileSync(yamlConfigFile, 'utf8'));
      Object.keys(config.env_variables).forEach(key => {
        process.env[key] = config.env_variables[key];
      });
    } else {
      throw new Error(`
      Missing app.yaml config file used while in development mode

      It should have contents similar to the example below:

      app.yaml
      -------------------------
      env_variables:
        PAYBILL_NUMBER: '000000'
        PASSKEY: 'a8eac82d7ac1461ba0348b0cb24d3f8140d3afb9be864e56a10d7e8026eaed66'
        MERCHANT_ENDPOINT: 'http://merchant-endpoint.com/mpesa/payment/complete'

      # Everything below from this point onwards are only relevant
      # if you are looking to deploy Project Mulla to Google App Engine.
      runtime: nodejs
      vm: true

      skip_files:
        - ^(.*/)?.*/node_modules/.*$
      -------------------------
    `);
    }
  }
}
