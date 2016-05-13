import uuid from 'node-uuid';
import checkoutRequest from '../controllers/checkout-request';
import confirmTransaction from '../controllers/confirm-transaction';


export default function(router) {
  /* Load up the homepage */
  router.get('/', function(req, res) {
    return res.json({ 'status': 200 });
  });

  router.get('/request/checkout', function(req, res, next) {
    let checkout = checkoutRequest.send(checkoutRequest.constructSOAPBody({
      referenceID: uuid.v4(),
      amountInDoubleFloat: '20.00',
      clientPhoneNumber: '254723001575',
      extraMerchantPayload: JSON.stringify({ 'extra': 'info', 'as': 'object' })
    }));

    // process checkout response
    checkout.then((response) => res.json(response)).catch((_error) => {
      let err = new Error('description' in _error ? _error.description : _error)
      err.status = 'httpCode' in _error ? _error.httpCode : 500;
      res.status(err.status).json({ response: _error });
      // next(err);
    });
  });

  router.get('/confirm/transaction', function(req, res, next) {
    let confirm = confirmTransaction.send(confirmTransaction.constructSOAPBody({
      transactionID: '99d0b1c0237b70f3dc63f36232b9984c',
      // merchantTransactionID: ''
    }));

    // process confirmTransaction response
    confirm.then((response) => res.json(response)).catch((_error) => {
      let err = new Error('description' in _error ? _error.description : _error)
      err.status = 'httpCode' in _error ? _error.httpCode : 500;
      res.status(err.status).json({ response: _error });
      // next(err);
    });
  });

  return router;
}
