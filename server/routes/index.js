import uuid from 'node-uuid';
import request from 'request';
import ResponseError from '../errors/ResponseError';
import ParseResponse from '../controllers/ParseResponse';
import PaymentRequest from '../controllers/PaymentRequest';
import ConfirmPayment from '../controllers/ConfirmPayment';
import PaymentStatus from '../controllers/PaymentStatus';
import SOAPRequest from '../controllers/request';


export default (router) => {
  /* Check the status of the API system */
  router.get('/', (req, res) => {
    return res.json({ 'status': 200 });
  });

  router.get('/payment/request', (req, res) => {
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
      if (!requiredBodyParams.includes(key)) {
        extraPayload[key] = req.body[key];
      }
    }

    let paymentDetails = {
      // transaction reference ID
      referenceID: (req.body.referenceID || uuid.v4()),
      // product, service or order ID
      merchantTransactionID: (req.body.merchantTransactionID || uuid.v1()),
      amountInDoubleFloat: (req.body.totalAmount || '10.00'),
      clientPhoneNumber: (req.body.phoneNumber || '254723001575'),
      extraPayload: JSON.stringify(extraPayload),
      timeStamp: req.timeStamp,
      encryptedPassword: req.encryptedPassword
    };

    let payment = new PaymentRequest(paymentDetails);
    let parser = new ParseResponse('processcheckoutresponse');
    let request = new SOAPRequest(payment, parser);

    // make the payment requets and process response
    request.post()
      .then(response => res.json(response))
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
      .then(response => res.json(response))
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
      .then(response => res.json(response))
      .catch(error => ResponseError(error, res));
  });

  // the SAG pings a callback request provided
  // via SOAP POST, HTTP POST or GET request
  router.all('/payment/success', (req, res) => {
    const keys = Object.keys(req.body);
    let response = {};

    for (const x of keys) {
      let prop = x.toLowerCase().replace(/\-/g, '');
      response[prop] = req.body[x];
    }

    // make a request to the merchant's endpoint
    request({
      'method': 'POST',
      'uri': process.env.MERCHANT_ENDPOINT,
      'rejectUnauthorized': false,
      'body': JSON.stringify(response),
      'headers': {
        'content-type': 'application/json; charset=utf-8'
      }
    }, (error, response, body) => {
      // merchant should respond with
      // an 'ok' or 'success'
    });

    res.status(200).status('ok'); // or 'success'
  });

  return router;
};
