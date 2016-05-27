'use strict';

const uuid = require('node-uuid');
const ParseResponse = require('../utils/ParseResponse');
const SOAPRequest = require('../controllers/SOAPRequest');
const responseError = require('../utils/errors/responseError');

module.exports = class PaymentRequest {
  constructor(data) {
    this.body = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="tns:ns">
      <soapenv:Header>
        <tns:CheckOutHeader>
          <MERCHANT_ID>${process.env.PAYBILL_NUMBER}</MERCHANT_ID>
          <PASSWORD>${data.encryptedPassword}</PASSWORD>
          <TIMESTAMP>${data.timeStamp}</TIMESTAMP>
        </tns:CheckOutHeader>
      </soapenv:Header>
      <soapenv:Body>
        <tns:processCheckOutRequest>
          <MERCHANT_TRANSACTION_ID>${data.merchantTransactionID}</MERCHANT_TRANSACTION_ID>
          <REFERENCE_ID>${data.referenceID}</REFERENCE_ID>
          <AMOUNT>${data.amountInDoubleFloat}</AMOUNT>
          <MSISDN>${data.clientPhoneNumber}</MSISDN>
          <ENC_PARAMS>
            ${data.extraPayload ? JSON.stringify(data.extraPayload) : ''}
          </ENC_PARAMS>
          <CALL_BACK_URL>${process.env.CALLBACK_URL}</CALL_BACK_URL>
          <CALL_BACK_METHOD>${process.env.CALLBACK_METHOD}</CALL_BACK_METHOD>
          <TIMESTAMP>${data.timeStamp}</TIMESTAMP>
        </tns:processCheckOutRequest>
      </soapenv:Body>
    </soapenv:Envelope>`;
  }

  requestBody() {
    return this.body;
  }

  static handler(req, res) {
    const paymentDetails = {
      // transaction reference ID
      referenceID: (req.body.referenceID || uuid.v4()),
      // product, service or order ID
      merchantTransactionID: (req.body.merchantTransactionID || uuid.v1()),
      amountInDoubleFloat: (req.body.totalAmount || process.env.TEST_AMOUNT),
      clientPhoneNumber: (req.body.phoneNumber || process.env.TEST_PHONENUMBER),
      extraPayload: req.body.extraPayload,
      timeStamp: req.timeStamp,
      encryptedPassword: req.encryptedPassword,
    };

    const payment = new PaymentRequest(paymentDetails);
    const parser = new ParseResponse('processcheckoutresponse');
    const soapRequest = new SOAPRequest(payment, parser);

    // remove encryptedPassword
    delete paymentDetails.encryptedPassword;

    // convert paymentDetails properties to underscore notation
    const returnThesePaymentDetails = {};
    for (const key of Object.keys(paymentDetails)) {
      const newkey = key.replace(/[A-Z]{1,}/g, match => '_' + match.toLowerCase());
      returnThesePaymentDetails[newkey] = paymentDetails[key];
      delete paymentDetails[key];
    }

    // make the payment requets and process response
    soapRequest.post()
      .then(response => res.status(200).json({
        response: Object.assign({}, response, returnThesePaymentDetails),
      }))
      .catch(error => responseError(error, res));
  }
};
