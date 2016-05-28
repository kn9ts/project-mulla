'use strict';

require('../../environment');
const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');

const paymentSuccess = require('../../server/controllers/PaymentSuccess');

const req = {};
req.protocol = 'https';
req.hostname = 'localhost';
req.body = {
  MSISDN: '254723001575',
  MERCHANT_TRANSACTION_ID: 'FG232FT0',
  USERNAME: '',
  PASSWORD: '',
  AMOUNT: '100',
  TRX_STATUS: 'Success',
  RETURN_CODE: '00',
  DESCRIPTION: 'Transaction successful',
  'M-PESA_TRX_DATE': '2014-08-01 15:30:00',
  'M-PESA_TRX_ID': 'FG232FT0',
  TRX_ID: '1448',
  ENC_PARAMS: '{}',
};
const res = {};
res.sendStatus = sinon.stub();

let error = false;
sinon.stub(paymentSuccess, 'request', (params, callback) => {
  callback(error);
});

describe('paymentSuccess', () => {
  it('Make a request to MERCHANT_ENDPOINT and respond to SAG with OK', (done) => {
    process.env.MERCHANT_ENDPOINT = process.env.ENDPOINT;
    paymentSuccess.handler(req, res);

    setTimeout(() => {
      assert.isTrue(res.sendStatus.calledWithExactly(200));
      done();
    }, 20);
  });

  it('If ENDPOINT is not reachable, an error reponse is sent back', (done) => {
    delete process.env.MERCHANT_ENDPOINT;
    error = new Error('ENDPOINT not reachable');
    paymentSuccess.handler(req, res);

    setTimeout(() => {
      assert.isTrue(res.sendStatus.calledWithExactly(500));
      done();
    }, 20);
  });
});
