'use strict';

require('../../environment');
const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');
const moment = require('moment');
const uuid = require('node-uuid');

const paymentRequest = require('../../server/controllers/PaymentRequest');
const confirmPayment = require('../../server/controllers/ConfirmPayment');
const GenEncryptedPassword = require('../../server/utils/GenEncryptedPassword');

process.env.API_VERSION = '1';

describe('paymentRequest', () => {
  const timeStamp = moment().format('YYYYMMDDHHmmss');
  const encryptedPassword = new GenEncryptedPassword(timeStamp).hashedPassword;
  const params = {
    referenceID: uuid.v4(),
    merchantTransactionID: uuid.v1(),
    amountInDoubleFloat: '100.00',
    clientPhoneNumber: '254723001575',
    extraPayload: {},
    timeStamp,
    encryptedPassword,
  };

  const req = {};
  req.protocol = 'https';
  req.hostname = 'sillyhostname.com';
  req.timeStamp = timeStamp;
  req.encryptedPassword = encryptedPassword;
  req.body = {
    totalAmount: '100.00',
    phoneNumber: '254723001575',
    extraPayload: {},
  };

  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub();

  const response = { status_code: 200 };
  const promise = new Promise((resolve) => { resolve(response); });

  sinon.stub(promise, 'then', (callback) => {
    callback(response);
    return promise;
  });

  sinon.stub(promise, 'catch', (callback) => {
    callback(new Error('threw an error'));
    return promise;
  });

  beforeEach(() => {
    promise.then.reset();
    promise.catch.reset();
  });

  paymentRequest.parser = sinon.stub().returnsThis();
  paymentRequest.soapRequest.construct = sinon.stub().returnsThis();
  paymentRequest.soapRequest.post = sinon.stub().returns(promise);

  confirmPayment.parser = sinon.stub().returnsThis();
  confirmPayment.soapRequest.construct = sinon.stub().returnsThis();
  confirmPayment.soapRequest.post = sinon.stub().returns(promise);

  it('BuildSoapBody builds the soap body string', () => {
    paymentRequest.buildSoapBody(params);

    assert.isString(paymentRequest.body);
    assert.match(paymentRequest.body, /(soapenv:Envelope)/gi);
  });

  it('Makes a SOAP request and returns a promise', () => {
    sinon.spy(confirmPayment, 'handler');
    paymentRequest.buildSoapBody = sinon.stub();
    paymentRequest.handler(req, res);

    assert.isTrue(paymentRequest.buildSoapBody.called);
    assert.isTrue(paymentRequest.soapRequest.construct.called);
    assert.isTrue(paymentRequest.soapRequest.post.called);

    assert.isTrue(confirmPayment.buildSoapBody.called);
    assert.isTrue(confirmPayment.soapRequest.construct.called);
    assert.isTrue(confirmPayment.soapRequest.post.called);

    assert.isTrue(promise.then.calledTwice);
    assert.isTrue(confirmPayment.handler.calledOnce);
    assert.isTrue(promise.catch.called);

    const spyCall = res.json.getCall(0);
    assert.isObject(spyCall.args[0]);
    assert.sameMembers(Object.keys(spyCall.args[0].response), [
      'status_code',
      'reference_id',
      'merchant_transaction_id',
      'amount_in_double_float',
      'client_phone_number',
      'extra_payload',
      'time_stamp',
      'callback_url',
    ]);
  });
});
