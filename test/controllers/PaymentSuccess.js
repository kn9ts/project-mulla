'use strict';

require('../../environment');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');

const paymentSuccess = require('../../server/controllers/PaymentSuccess');

describe('paymentSuccess', () => {
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
  const next = sinon.stub();

  const response = {};
  for (const x of Object.keys(req.body)) {
    const prop = x.toLowerCase().replace(/\-/g, '');
    response[prop] = req.body[x];
  }

  let error = false;
  sinon.stub(paymentSuccess, 'request', (params, callback) => {
    callback(error);
  });

  it('Make a request to MERCHANT_ENDPOINT and respond to SAG with OK', () => {
    process.env.MERCHANT_ENDPOINT = 'https://awesome-service.com/mpesa/callback';
    paymentSuccess.handler(req, res, next);

    const spyCall = paymentSuccess.request.getCall(0);
    const args = spyCall.args[0];

    assert.isTrue(res.sendStatus.calledWithExactly(200));
    assert.isTrue(paymentSuccess.request.called);
    assert.isFalse(next.called);
    expect(response).to.deep.equal(JSON.parse(args.body));
  });

  it('If MERCHANT_ENDPOINT is not provided, next is passed an error', () => {
    delete process.env.MERCHANT_ENDPOINT;
    process.env.NODE_ENV = 'production';
    paymentSuccess.handler(req, res, next);

    console.log(next.args);
    const spyCall = next.getCall(0);
    const args = spyCall.args[0];

    assert.isTrue(next.called);
    assert.isTrue(args instanceof Error);
  });

  it('If ENDPOINT is not reachable, an error reponse is sent back', () => {
    process.env.MERCHANT_ENDPOINT = 'https://undefined-url';
    error = new Error('ENDPOINT not reachable');
    paymentSuccess.handler(req, res, next);

    assert.isTrue(res.sendStatus.calledWithExactly(500));
  });
});
