'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

// default configuration
process.env.API_VERSION = 1;

// if an env has not been provided, default to development
if (!('NODE_ENV' in process.env)) process.env.NODE_ENV = 'development';

if (process.env.NODE_ENV === 'development') {
  // Get the rest of the config from app.yaml config file
  const config = yaml.safeLoad(fs.readFileSync('app.yaml', 'utf8'));
  Object.keys(config.env_variables).forEach(key => {
    process.env[key] = config.env_variables[key];
  });
}
