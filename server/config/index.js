'use strict';
module.exports = function(value) {
  var envVariables = {
      host: process.env.HOST,
      database: process.env.DATABASE,
      expressSessionKey: process.env.EXPRESS_SESSION_KEY,
      webTokenSecret: process.env.WEB_TOKEN_SECRET
    },
    environments = {
      development: envVariables,
      staging: envVariables,
      production: envVariables
    };
  return environments[value] ? environments[value] : environments.development;
};
