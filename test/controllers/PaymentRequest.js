'use strict';

require('../../environment');
const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');
const moment = require('moment');
const uuid = require('node-uuid');

const paymentRequest = require('../../server/controllers/PaymentRequest');
const GenEncryptedPassword = require('../../server/utils/GenEncryptedPassword');

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
const res = {};
const response = { status_code: 200 };
const promise = new Promise((resolve) => {
  resolve(response);
});

sinon.stub(promise, 'then', (callback) => {
  callback(response);
  return promise;
});

sinon.stub(promise, 'catch', (callback) => {
  callback(new Error('threw an error'));
  return promise;
});

describe('paymentRequest', () => {
  beforeEach(() => {
    req.timeStamp = timeStamp;
    req.encryptedPassword = encryptedPassword;
    req.body = {
      totalAmount: '100.00',
      phoneNumber: '254723001575',
      extraPayload: {},
    };

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub();

    paymentRequest.parser = sinon.stub().returnsThis();
    paymentRequest.soapRequest.construct = sinon.stub().returnsThis();
    paymentRequest.soapRequest.post = sinon.stub().returns(promise);
  });

  it('BuildSoapBody builds the soap body string', () => {
    paymentRequest.buildSoapBody(params);

    assert.isString(paymentRequest.body);
    assert.match(paymentRequest.body, /(soapenv:Envelope)/gi);
  });

  it('Makes a SOAP request and returns a promise', () => {
    paymentRequest.buildSoapBody = sinon.stub();
    paymentRequest.handler(req, res);

    assert.isTrue(paymentRequest.buildSoapBody.called);
    assert.isTrue(paymentRequest.soapRequest.construct.called);
    assert.isTrue(paymentRequest.soapRequest.post.called);

    assert.isTrue(promise.then.called);
    assert.isTrue(promise.catch.called);
    assert.isTrue(res.status.calledWithExactly(200));
    assert.isTrue(res.json.called);

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
    ]);
  });
});
