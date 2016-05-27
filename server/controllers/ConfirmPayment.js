'use strict';

const ParseResponse = require('../utils/ParseResponse');
const SOAPRequest = require('../controllers/SOAPRequest');
const responseError = require('../utils/errors/responseError');

module.exports = class ConfirmPayment {
  constructor(data) {
    const transactionConfirmRequest = typeof data.transactionID !== undefined ?
      '<TRX_ID>' + data.transactionID + '</TRX_ID>' :
      '<MERCHANT_TRANSACTION_ID>' + data.merchantTransactionID + '</MERCHANT_TRANSACTION_ID>';

    this.body = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="tns:ns">
      <soapenv:Header>
        <tns:CheckOutHeader>
          <MERCHANT_ID>${process.env.PAYBILL_NUMBER}</MERCHANT_ID>
          <PASSWORD>${data.encryptedPassword}</PASSWORD>
          <TIMESTAMP>${data.timeStamp}</TIMESTAMP>
        </tns:CheckOutHeader>
      </soapenv:Header>
      <soapenv:Body>
        <tns:transactionConfirmRequest>
          ${transactionConfirmRequest}
        </tns:transactionConfirmRequest>
      </soapenv:Body>
    </soapenv:Envelope>`;
  }

  requestBody() {
    return this.body;
  }

  static handler(req, res) {
    const payment = new ConfirmPayment({
      transactionID: req.params.id, // eg. '99d0b1c0237b70f3dc63f36232b9984c'
      timeStamp: req.timeStamp,
      encryptedPassword: req.encryptedPassword,
    });
    const parser = new ParseResponse('transactionconfirmresponse');
    const confirm = new SOAPRequest(payment, parser);

    // process ConfirmPayment response
    confirm.post()
      .then(response => res.status(200).json({ response }))
      .catch(error => responseError(error, res));
  }
};
