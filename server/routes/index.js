import uuid from 'node-uuid';
import checkoutRequest from '../controllers/checkout-request';


export default function(router) {
  /* Load up the homepage */
  router.get('/', function(req, res) {
    return res.json({ 'status': 200 });
  });

  router.get('/request/checkout', function(req, res) {
    let checkout = checkoutRequest.send(checkoutRequest.constructSOAPBody({
      referenceID: uuid.v4(),
      amountInDoubleFloat: '20.00',
      clientPhoneNumber: '254723001575',
      extraMerchantPayload: JSON.stringify({ 'extra': 'info', 'as': 'object' })
    }));

    // process checkout response
    checkout.then((response) => res.json(response)).catch((err) => next(err));
  });

  return router;
}
