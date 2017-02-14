'use strict';

const ParseResponse = require('../utils/ParseResponse');
const SOAPRequest = require('../utils/SOAPRequest');

const parseResponse = new ParseResponse('transactionconfirmresponse');
const soapRequest = new SOAPRequest();

class ConfirmPayment {
  constructor(request, parser) {
    this.parser = parser;
    this.soapRequest = request;
  }

  buildSoapBody(data) {
    const transactionConfirmRequest = typeof data.transactionID !== 'undefined' ?
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

    return this;
  }

  handler(params) {
    const paymentDetails = {
      transactionID: params.transactionID, // eg. '99d0b1c0237b70f3dc63f36232b9984c'
      timeStamp: params.timeStamp,
      encryptedPassword: params.encryptedPassword,
    };
    const payment = this.buildSoapBody(paymentDetails);
    const confirm = this.soapRequest.construct(payment, this.parser);

    // process ConfirmPayment response
    return confirm.post();
  }
}

module.exports = new ConfirmPayment(soapRequest, parseResponse);
