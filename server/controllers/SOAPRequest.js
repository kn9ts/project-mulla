'use strict';

const request = require('request');

module.exports = class SOAPRequest {
  constructor(payment, parser) {
    this.parser = parser;
    this.requestOptions = {
      method: 'POST',
      uri: process.env.ENDPOINT,
      rejectUnauthorized: false,
      body: payment.requestBody(),
      headers: {
        'content-type': 'application/xml; charset=utf-8',
      },
    };
  }

  post() {
    return new Promise((resolve, reject) => {
      // Make the soap request to the SAG URI
      request(this.requestOptions, (error, response, body) => {
        if (error) {
          reject(error);
          return;
        }

        const parsedResponse = this.parser.parse(body);
        const json = parsedResponse.toJSON();

        // Anything that is not "00" as the
        // SOAP response code is a Failure
        if (json.status_code !== 200) {
          reject(json);
          return;
        }

        // Else everything went well
        resolve(json);
      });
    });
  }
};
