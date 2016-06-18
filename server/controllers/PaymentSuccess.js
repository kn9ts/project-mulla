'use strict';

const request = require('request');

class PaymentSuccess {
  constructor() {
    this.request = request;
  }

  handler(req, res, next) {
    const response = {};
    const baseURL = `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}`;
    let endpoint = `${baseURL}/api/v1/thumbs/up`;

    if ('MERCHANT_ENDPOINT' in process.env) {
      endpoint = process.env.MERCHANT_ENDPOINT;
    } else {
      if (process.env.NODE_ENV !== 'development') {
        next(new Error('MERCHANT_ENDPOINT has not been provided in environment configuration'));
        return;
      }
    }

    for (const key of Object.keys(req.body)) {
      const prop = key.toLowerCase().replace(/\-/g, '');
      response[prop] = req.body[key];
    }

    if ('enc_params' in response) {
      // decrypted encrypted extra parameters provided in ENC_PARAMS
      response.enc_params = JSON.parse(new Buffer(response.enc_params, 'base64').toString());
    }

    const requestParams = {
      method: 'POST',
      uri: endpoint,
      rejectUnauthorized: false,
      body: JSON.stringify({ response }),
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
