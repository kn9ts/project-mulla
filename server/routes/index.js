import uuid from 'node-uuid';
import request from 'request';
import ResponseError from '../errors/ResponseError';
import ParseResponse from '../utils/ParseResponse';
import PaymentRequest from '../controllers/PaymentRequest';
import ConfirmPayment from '../controllers/ConfirmPayment';
import PaymentStatus from '../controllers/PaymentStatus';
import SOAPRequest from '../controllers/request';


export default (router) => {
  /* Check the status of the API system */
  router.get('/', (req, res) => {
    return res.json({ 'status': 200 });
  });

  router.post('/payment/request', (req, res) => {
    const requiredBodyParams = [
      'referenceID',
      'merchantTransactionID',
      'totalAmount',
      'phoneNumber'
    ];

    const extraPayload = {};
    const bodyParamKeys = Object.keys(req.body);

    // anything that is not required should be added
    // to the extraPayload object
    for (const key of bodyParamKeys) {
      if (requiredBodyParams.indexOf(key) == -1) {
        extraPayload[key] = req.body[key];
      }
    }

    let paymentDetails = {
      // transaction reference ID
      referenceID: (req.body.referenceID || uuid.v4()),
      // product, service or order ID
      merchantTransactionID: (req.body.merchantTransactionID || uuid.v1()),
      amountInDoubleFloat: (req.body.totalAmount || process.env.TEST_AMOUNT),
      clientPhoneNumber: (req.body.phoneNumber || process.env.TEST_PHONENUMBER),
      extraPayload: JSON.stringify(extraPayload),
      timeStamp: req.timeStamp,
      encryptedPassword: req.encryptedPassword
    };

    let payment = new PaymentRequest(paymentDetails);
    let parser = new ParseResponse('processcheckoutresponse');
    let request = new SOAPRequest(payment, parser);

    // remove encryptedPassword and extraPayload
    // should not be added to response object
    delete paymentDetails.encryptedPassword;
    delete paymentDetails.extraPayload;

    // make the payment requets and process response
    request.post()
      .then(response => res.json({
        response: Object.assign({}, response, paymentDetails)
      }))
      .catch(error => ResponseError(error, res));
  });

  router.get('/payment/confirm/:id', (req, res) => {
    let payment = new ConfirmPayment({
      transactionID: req.params.id, // eg. '99d0b1c0237b70f3dc63f36232b9984c'
      timeStamp: req.timeStamp,
      encryptedPassword: req.encryptedPassword
    });
    let parser = new ParseResponse('transactionconfirmresponse');
    let confirm = new SOAPRequest(payment, parser);

    // process ConfirmPayment response
    confirm.post()
      .then(response => res.json({ response: response }))
      .catch(error => ResponseError(error, res));
  });

  router.get('/payment/status/:id', (req, res) => {
    let payment = new PaymentStatus({
      transactionID: req.params.id,
      timeStamp: req.timeStamp,
      encryptedPassword: req.encryptedPassword
    });
    let parser = new ParseResponse('transactionstatusresponse');
    let status = new SOAPRequest(payment, parser);

    // process PaymentStatus response
    status.post()
      .then(response => res.json({ response: response }))
      .catch(error => ResponseError(error, res));
  });

  // the SAG pings a callback request provided
  // via SOAP POST, HTTP POST or GET request
  router.all('/payment/success', (req, res) => {
    const keys = Object.keys(req.body);
    let response = {};
    let baseURL = `${req.protocol}://${req.hostname}:${process.env.PORT}`;
    let testEndpoint = `${baseURL}/api/v1/thumbs/up`;
    let endpoint = 'MERCHANT_ENDPOINT' in process.env ? process.env.MERCHANT_ENDPOINT : testEndpoint;
    console.log('endpoint:', endpoint)

    for (const x of keys) {
      let prop = x.toLowerCase().replace(/\-/g, '');
      response[prop] = req.body[x];
    }

    const requestParams = {
      'method': 'POST',
      'uri': endpoint,
      'rejectUnauthorized': false,
      'body': JSON.stringify(response),
      'headers': {
        'content-type': 'application/json; charset=utf-8'
      }
    };

    // make a request to the merchant's endpoint
    request(requestParams, (error, response, body) => {
      if (error) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });

  // for testing last POST response
  // if MERCHANT_ENDPOINT has not been provided
  router.all('/thumbs/up', (req, res) => {
    return res.sendStatus(200);
  });

  return router;
};
