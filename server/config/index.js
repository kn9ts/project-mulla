'use strict';

module.exports = (value) => {
  const envVariables = {
    expressSessionKey: process.env.EXPRESS_SESSION_KEY,
  };

  const environments = {
    development: envVariables,
    staging: envVariables,
    production: envVariables,
  };
  return environments[value] ? environments[value] : environments.development;
};
