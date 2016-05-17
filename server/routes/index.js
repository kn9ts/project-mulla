import uuid from 'node-uuid';
import ParseResponse from '../controllers/parse-response';
import ResponseError from '../controllers/errorhandler';
import PaymentRequest from '../controllers/payment-request';
import ConfirmPayment from '../controllers/payment-confirm';
import PaymentStatus from '../controllers/payment-status';
import SOAPRequest from '../controllers/request';


export default function(router) {
  /* Check the status of the API system */
  router.get('/', function(req, res) {
    return res.json({ 'status': 200 });
  });

  router.get('/payment/request', function(req, res) {
    let extraPayload = { 'extra': 'info', 'as': 'object' };
    let paymentDetails = {
      referenceID: uuid.v4(), // product, service or order ID
      merchantTransactionID: uuid.v1(), // time-based
      amountInDoubleFloat: '10.00',
      clientPhoneNumber: '254723001575',
      extraMerchantPayload: JSON.stringify(extraPayload)
    };

    let payment = new PaymentRequest(paymentDetails);
    let parser = new ParseResponse('processcheckoutresponse');
    let request = new SOAPRequest(payment, parser);

    // make the payment requets and process response
    request.post()
      .then((response) => res.json(response))
      .catch((_error) => ResponseError.handler(_error, res));
  });

  router.get('/payment/confirm/:id', function(req, res) {
    let payment = new ConfirmPayment({
      transactionID: req.params.id // eg. '99d0b1c0237b70f3dc63f36232b9984c'
    });
    let parser = new ParseResponse('transactionconfirmresponse');
    let confirm = new SOAPRequest(payment, parser);

    // process ConfirmPayment response
    confirm.post()
      .then((response) => res.json(response))
      .catch((_error) => ResponseError.handler(_error, res));
  });

  router.get('/payment/status/:id', function(req, res) {
    let payment = new PaymentStatus({
      transactionID: req.params.id // eg. '99d0b1c0237b70f3dc63f36232b9984c'
    });
    let parser = new ParseResponse('transactionstatusresponse');
    let status = new SOAPRequest(payment, parser);

    // process PaymentStatus response
    status.post()
      .then((response) => res.json(response))
      .catch((_error) => ResponseError.handler(_error, res));
  });

  return router;
}
