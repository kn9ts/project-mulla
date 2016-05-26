'use strict';
const uuid = require('node-uuid');
const request = require('request');
const responseError = require('../utils/errors/responseError');
const ParseResponse = require('../utils/ParseResponse');
const requiredParams = require('../validators/requiredParams');
const PaymentRequest = require('../controllers/PaymentRequest');
const ConfirmPayment = require('../controllers/ConfirmPayment');
const PaymentStatus = require('../controllers/PaymentStatus');
const SOAPRequest = require('../controllers/SOAPRequest');


module.exports = (router) => {
  /* Check the status of the API system */
  router.get('/', (req, res) => res.json({ status: 200 }));

  router.post('/payment/request', requiredParams, (req, res) => {
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
    // should not be added to response object
    delete paymentDetails.encryptedPassword;

    // convert paymentDetails properties to underscore notation
    // to match the SAG JSON response
    for (const key of Object.keys(paymentDetails)) {
      const newkey = key.replace(/[A-Z]{1,}/g, match => '_' + match.toLowerCase());
      paymentDetails[newkey] = paymentDetails[key];
      delete paymentDetails[key];
    }

    // make the payment requets and process response
    soapRequest.post()
      .then(response => res.json({
        response: Object.assign({}, response, paymentDetails),
      }))
      .catch(error => responseError(error, res));
  });

  router.get('/payment/confirm/:id', (req, res) => {
    const payment = new ConfirmPayment({
      transactionID: req.params.id, // eg. '99d0b1c0237b70f3dc63f36232b9984c'
      timeStamp: req.timeStamp,
      encryptedPassword: req.encryptedPassword,
    });
    const parser = new ParseResponse('transactionconfirmresponse');
    const confirm = new SOAPRequest(payment, parser);

    // process ConfirmPayment response
    confirm.post()
      .then(response => res.json({ response }))
      .catch(error => responseError(error, res));
  });

  router.get('/payment/status/:id', (req, res) => {
    const payment = new PaymentStatus({
      transactionID: req.params.id,
      timeStamp: req.timeStamp,
      encryptedPassword: req.encryptedPassword,
    });
    const parser = new ParseResponse('transactionstatusresponse');
    const status = new SOAPRequest(payment, parser);

    // process PaymentStatus response
    status.post()
      .then(response => res.json({ response }))
      .catch(error => responseError(error, res));
  });

  // the SAG pings a callback request provided
  // via SOAP POST, HTTP POST or GET request
  router.all('/payment/success', (req, res) => {
    const keys = Object.keys(req.body);
    const response = {};
    const baseURL = `${req.protocol}://${req.hostname}:${process.env.PORT}`;
    const testEndpoint = `${baseURL}/api/v1/thumbs/up`;
    const endpoint = 'MERCHANT_ENDPOINT' in process.env ?
      process.env.MERCHANT_ENDPOINT : testEndpoint;

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
    request(requestParams, (error) => {
      if (error) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });

  // for testing last POST response
  // if MERCHANT_ENDPOINT has not been provided
  router.all('/thumbs/up', (req, res) => res.sendStatus(200));

  return router;
};
