import uuid from 'node-uuid';
import request from 'request';
import ParseResponse from '../controllers/parse-response';
import ResponseError from '../controllers/response-error';
import PaymentRequest from '../controllers/payment-request';
import ConfirmPayment from '../controllers/payment-confirm';
import PaymentStatus from '../controllers/payment-status';
import SOAPRequest from '../controllers/request';


export default (router) => {
  /* Check the status of the API system */
  router.get('/', (req, res) => {
    return res.json({ 'status': 200 });
  });

  router.get('/payment/request', (req, res) => {
    let extraPayload = { 'extra': 'info', 'as': 'object' };
    let paymentDetails = {
      referenceID: uuid.v4(), // product, service or order ID
      merchantTransactionID: uuid.v1(), // time-based
      amountInDoubleFloat: '10.00',
      clientPhoneNumber: '254723001575',
      extraMerchantPayload: JSON.stringify(extraPayload),
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
