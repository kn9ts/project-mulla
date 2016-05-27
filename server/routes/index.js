'use strict';

const PaymentRequest = require('../controllers/PaymentRequest');
const ConfirmPayment = require('../controllers/ConfirmPayment');
const PaymentStatus = require('../controllers/PaymentStatus');
const PaymentSuccess = require('../controllers/PaymentSuccess');

const requiredParams = require('../validators/checkForRequiredParams');
const SOAPRequest = require('../controllers/SOAPRequest');


module.exports = (router) => {
  // check the status of the API system
  router.get('/status', (req, res) => res.json({ status: 200 }));

  router.post('/payment/request', requiredParams, PaymentRequest.handler);
  router.get('/payment/confirm/:id', ConfirmPayment.handler);
  router.get('/payment/status/:id', PaymentStatus.handler);
  router.all('/payment/success', PaymentSuccess.handler);

  // for testing last POST response
  // if MERCHANT_ENDPOINT has not been provided
  router.all('/thumbs/up', (req, res) => res.sendStatus(200));

  return router;
};
