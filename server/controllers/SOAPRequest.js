'use strict';

const request = require('request');

module.exports = class SOAPRequest {
  construct(payment, parser) {
    this.request = request;
    this.parser = parser;
    this.requestOptions = {
      method: 'POST',
      uri: process.env.ENDPOINT,
      rejectUnauthorized: false,
      body: payment.body,
      headers: {
        'content-type': 'application/xml; charset=utf-8',
      },
    };
    return this;
  }

  post() {
    return new Promise((resolve, reject) => {
      // Make the soap request to the SAG URI
      this.request(this.requestOptions, (error, response, body) => {
        if (error) {
          reject({ description: error.message });
          return;
        }

        const parsedResponse = this.parser.parse(body);
        const json = parsedResponse.toJSON();

        // Anything that is not "00" as the
        // SOAP response code is a Failure
        if (json && json.status_code !== 200) {
          reject(json);
          return;
        }

        // Else everything went well
        resolve(json);
      });
    });
  }
};
