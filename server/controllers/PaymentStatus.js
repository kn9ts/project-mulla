'use strict';

const ParseResponse = require('../utils/ParseResponse');
const SOAPRequest = require('../controllers/SOAPRequest');
const responseError = require('../utils/errors/responseError');

const parseResponse = new ParseResponse('transactionstatusresponse');
const soapRequest = new SOAPRequest();

class PaymentStatus {
  constructor(request, parser) {
    this.parser = parser;
    this.soapRequest = request;
  }

  buildSoapBody(data) {
    const transactionStatusRequest = typeof data.transactionID !== 'undefined' ?
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
        <tns:transactionStatusRequest>
          ${transactionStatusRequest}
        </tns:transactionStatusRequest>
      </soapenv:Body>
    </soapenv:Envelope>`;

    return this;
  }

  handler(req, res) {
    const paymentDetails = {
      transactionID: req.params.id,
      timeStamp: req.timeStamp,
      encryptedPassword: req.encryptedPassword,
    };
    const payment = this.buildSoapBody(paymentDetails);
    const status = this.soapRequest.construct(payment, this.parser);

    // process PaymentStatus response
    return status.post()
      .then(response => res.status(200).json({ response }))
      .catch(error => responseError(error, res));
  }
}

module.exports = new PaymentStatus(soapRequest, parseResponse);
