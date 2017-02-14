'use strict';

const PaymentRequest = require('../controllers/PaymentRequest');
const PaymentStatus = require('../controllers/PaymentStatus');
const PaymentSuccess = require('../controllers/PaymentSuccess');
const checkForRequiredParams = require('../validators/checkForRequiredParams');


module.exports = (router) => {
  const paymentRequestHandler = (req, res) => PaymentRequest.handler(req, res);

  // check the status of the API system
  router.get('/status', (req, res) => res.json({ status: 200 }));

  router.post('/payment/request', checkForRequiredParams, paymentRequestHandler);
  router.get('/payment/status/:id', (req, res) => PaymentStatus.handler(req, res));
  router.all('/payment/success', (req, res) => PaymentSuccess.handler(req, res));

  // for testing last POST response
  // if MERCHANT_ENDPOINT has not been provided
  router.all('/thumbs/up', (req, res) => res.sendStatus(200));

  return router;
};
