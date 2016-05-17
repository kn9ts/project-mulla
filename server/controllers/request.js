import request from 'request';


export default class SOAPRequest {
  constructor(payment, parser) {
    this.parser = parser;
    this.requestOptions = {
      'method': 'POST',
      'uri': process.env.ENDPOINT,
      'rejectUnauthorized': false,
      'body': payment.requestBody(),
      'headers': {
        'content-type': 'application/xml; charset=utf-8'
      }
    };
  }

  post() {
    return new Promise((resolve, reject) => {
      // Make the soap request to the SAG URI
      request(this.requestOptions, (_error, response, body) => {
        if (_error) {
          reject(_error);
          return;
        }

        let parsedResponse = this.parser.parse(body);
        let json = parsedResponse.toJSON();

        // Anything that is not "00" as the
        // SOAP response code is a Failure
        if (json.httpCode !== 200) {
          reject(json);
          return;
        }

        // Else everything went well
        resolve(json);
      });
    });
  }
}
