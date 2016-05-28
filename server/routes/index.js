'use strict';

const PaymentRequest = require('../controllers/PaymentRequest');
const ConfirmPayment = require('../controllers/ConfirmPayment');
const PaymentStatus = require('../controllers/PaymentStatus');
const PaymentSuccess = require('../controllers/PaymentSuccess');
const checkForRequiredParams = require('../validators/checkForRequiredParams');


module.exports = (router) => {
  // check the status of the API system
  router.get('/status', (req, res) => res.json({ status: 200 }));

  router.post(
    '/payment/request',
    checkForRequiredParams,
    (req, res) => PaymentRequest.handler(req, res)
  );
  router.get('/payment/confirm/:id', (req, res) => ConfirmPayment.handler(req, res));
  router.get('/payment/status/:id', (req, res) => PaymentStatus.handler(req, res));
  router.all('/payment/success', (req, res) => PaymentSuccess.handler(req, res));

  // for testing last POST response
  // if MERCHANT_ENDPOINT has not been provided
  router.all('/thumbs/up', (req, res) => res.sendStatus(200));

  return router;
};
