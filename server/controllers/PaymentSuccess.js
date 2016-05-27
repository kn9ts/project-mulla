'use strict';

const request = require('request');

module.exports = class PaymentSuccess {
  static handler(req, res) {
    const keys = Object.keys(req.body);
    const response = {};
    const baseURL = `${req.protocol}://${req.hostname}:${process.env.PORT}`;
    const testEndpoint = `${baseURL}/api/v1/thumbs/up`;
    const endpoint = 'MERCHANT_ENDPOINT' in process.env ?
      process.env.MERCHANT_ENDPOINT : testEndpoint;

    for (const x of keys) {
      const prop = x.toLowerCase().replace(/\-/g, '');
      response[prop] = req.body[x];
    }

    const requestParams = {
      method: 'POST',
      uri: endpoint,
      rejectUnauthorized: false,
      body: JSON.stringify(response),
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    };

    // make a request to the merchant's endpoint
    request(requestParams, (error) => {
      if (error) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  }
};
