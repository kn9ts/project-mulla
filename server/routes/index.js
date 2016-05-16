import uuid from 'node-uuid';
import ResponseError from '../controllers/errorhandler';
import PaymentRequest from '../controllers/payment-request';
import ConfirmPayment from '../controllers/payment-confirm';
import PaymentStatus from '../controllers/payment-status';


export default function(router) {
  /* Check the status of the API system */
  router.get('/', function(req, res) {
    return res.json({ 'status': 200 });
  });

  router.get('/payment/request', function(req, res) {
    let request = PaymentRequest.send(PaymentRequest.construct({
      referenceID: uuid.v4(), // product, service or order ID
      merchantTransactionID: uuid.v1(), // time-based
      amountInDoubleFloat: '10.00',
      clientPhoneNumber: '254723001575',
      extraMerchantPayload: JSON.stringify({ 'extra': 'info', 'as': 'object' })
    }));

    // process request response
    request.then((response) => res.json(response))
      .catch((_error) => ResponseError.handler(_error, res));
  });

  router.get('/payment/confirm/:id', function(req, res) {
    let confirm = ConfirmPayment.send(ConfirmPayment.construct({
      transactionID: req.params.id // eg. '99d0b1c0237b70f3dc63f36232b9984c'
    }));

    // process ConfirmPayment response
    confirm.then((response) => res.json(response))
      .catch((_error) => ResponseError.handler(_error, res));
  });

  router.get('/payment/status/:id', function(req, res) {
    let status = PaymentStatus.send(PaymentStatus.construct({
      transactionID: req.params.id // eg. '99d0b1c0237b70f3dc63f36232b9984c'
    }));

    // process PaymentStatus response
    status.then((response) => res.json(response))
      .catch((_error) => ResponseError.handler(_error, res));
  });

  return router;
}
