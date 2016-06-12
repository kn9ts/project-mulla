'use strict';

const request = require('request');

class PaymentSuccess {
  constructor() {
    this.request = request;
  }

  handler(req, res, next) {
    const keys = Object.keys(req.body);
    const response = {};
    const baseURL = `${req.protocol}://${req.hostname}:${process.env.PORT}`;
    let endpoint = `${baseURL}/api/v1/thumbs/up`;

    if ('MERCHANT_ENDPOINT' in process.env) {
      endpoint = process.env.MERCHANT_ENDPOINT;
    } else {
      if (process.env.NODE_ENV !== 'development') {
        next(new Error('MERCHANT_ENDPOINT has not been provided in environment configuration'));
        return;
      }
    }

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
    this.request(requestParams, (error) => {
      if (error) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  }
}

module.exports = new PaymentSuccess();
