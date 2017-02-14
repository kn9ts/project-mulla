'use strict';

const uuid = require('node-uuid');

const ConfirmPayment = require('../controllers/ConfirmPayment');

const ParseResponse = require('../utils/ParseResponse');
const SOAPRequest = require('../utils/SOAPRequest');
const responseError = require('../utils/errors/responseError');

const parseResponse = new ParseResponse('processcheckoutresponse');
const soapRequest = new SOAPRequest();

class PaymentRequest {
  constructor(request, parser) {
    this.parser = parser;
    this.soapRequest = request;
    this.callbackMethod = 'POST';
  }

  buildSoapBody(data) {
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
          <MERCHANT_TRANSACTION_ID>${data.merchantTransactionID}
          </MERCHANT_TRANSACTION_ID>
          <REFERENCE_ID>${String(data.referenceID).slice(0, 8)}</REFERENCE_ID>
          <AMOUNT>${data.amountInDoubleFloat}</AMOUNT>
          <MSISDN>${data.clientPhoneNumber}</MSISDN>
          <ENC_PARAMS>${JSON.stringify(data.extraPayload)}</ENC_PARAMS>
          <CALL_BACK_URL>${data.callbackURL}</CALL_BACK_URL>
          <CALL_BACK_METHOD>${this.callbackMethod}</CALL_BACK_METHOD>
          <TIMESTAMP>${data.timeStamp}</TIMESTAMP>
        </tns:processCheckOutRequest>
      </soapenv:Body>
    </soapenv:Envelope>`;

    return this;
  }

  handler(req, res) {
    const paymentDetails = {
      // transaction reference ID
      referenceID: (req.body.referenceID || uuid.v4()),
      // product, service or order ID
      merchantTransactionID: (req.body.merchantTransactionID || uuid.v1()),
      amountInDoubleFloat: req.body.totalAmount,
      clientPhoneNumber: req.body.phoneNumber,
      extraPayload: (req.body.extraPayload || {}),
      timeStamp: req.timeStamp,
      encryptedPassword: req.encryptedPassword,
      callbackURL: `${req.protocol}://${req.hostname}/api/v${process.env.API_VERSION}/payment/success`,
    };

    const payment = this.buildSoapBody(paymentDetails);
    const request = this.soapRequest.construct(payment, this.parser);

    // remove encryptedPassword
    delete paymentDetails.encryptedPassword;

    // convert paymentDetails properties to underscore notation
    const returnThesePaymentDetails = {};
    for (const key of Object.keys(paymentDetails)) {
      const newkey = key.replace(/[A-Z]{1,}/g, match => '_' + match.toLowerCase());
      returnThesePaymentDetails[newkey] = paymentDetails[key];
      delete paymentDetails[key];
    }

    let finalResponse;
    return request.post()
      .then(response => {
        finalResponse = {
          response: Object.assign({}, response, returnThesePaymentDetails),
        };

        const params = {
          transactionID: response.trx_id,
          timeStamp: req.timeStamp,
          encryptedPassword: req.encryptedPassword,
        };
        return ConfirmPayment.handler(params);
      })
      .then(() => res.status(200).json(finalResponse))
      .catch(error => responseError(error, res));
  }
}

module.exports = new PaymentRequest(soapRequest, parseResponse);
