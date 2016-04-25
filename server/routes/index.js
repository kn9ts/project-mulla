import uuid from 'node-uuid';
import cRequest from '../controllers/checkout-request.js';

export default function(router) {
  /* Load up the homepage */
  router.get('/', function(req, res) {
    // res.sendFile('index.html', {root: './public/'});
    res.render('index', { title: 'Express' });
  });

  router.get('/request/checkout', function(req, res) {
    cRequest.send(cRequest.constructSOAPBody({
      referenceID: uuid.v4(),
      amountInDoubleFloat: '10.00',
      clientPhoneNumber: '254723001575'
    }));
    res.json({ 'status': true });
  });

  return router;
}
