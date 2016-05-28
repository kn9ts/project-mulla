'use strict';

require('../../environment');
const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');
const moment = require('moment');
const uuid = require('node-uuid');

const paymentStatus = require('../../server/controllers/PaymentStatus');
const GenEncryptedPassword = require('../../server/utils/GenEncryptedPassword');

const timeStamp = moment().format('YYYYMMDDHHmmss');
const encryptedPassword = new GenEncryptedPassword(timeStamp).hashedPassword;
const params = {
  transactionID: uuid.v1(),
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

describe('paymentStatus', () => {
  beforeEach(() => {
    req.timeStamp = timeStamp;
    req.encryptedPassword = encryptedPassword;
    req.params = {
      id: uuid.v1(),
    };

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub();

    paymentStatus.parser = sinon.stub().returnsThis();
    paymentStatus.soapRequest.construct = sinon.stub().returnsThis();
    paymentStatus.soapRequest.post = sinon.stub().returns(promise);
  });

  it('BuildSoapBody builds the soap body string with transactionID', () => {
    paymentStatus.buildSoapBody(params);

    assert.isString(paymentStatus.body);
    assert.match(paymentStatus.body, /(TRX_ID)/);
    assert.notMatch(paymentStatus.body, /(MERCHANT_TRANSACTION_ID)/);
    assert.match(paymentStatus.body, /(soapenv:Envelope)/gi);
  });

  it('if transactionID is not provide soap body built with merchantTransactionID', () => {
    delete params.transactionID;
    params.merchantTransactionID = uuid.v4();
    paymentStatus.buildSoapBody(params);

    assert.isString(paymentStatus.body);
    assert.match(paymentStatus.body, /(MERCHANT_TRANSACTION_ID)/);
    assert.notMatch(paymentStatus.body, /(TRX_ID)/);
    assert.match(paymentStatus.body, /(soapenv:Envelope)/gi);
  });

  it('Makes a SOAP request and returns a promise', () => {
    paymentStatus.buildSoapBody = sinon.stub();
    paymentStatus.handler(req, res);

    assert.isTrue(paymentStatus.buildSoapBody.called);
    assert.isTrue(paymentStatus.soapRequest.construct.called);
    assert.isTrue(paymentStatus.soapRequest.post.called);

    assert.isTrue(promise.then.called);
    assert.isTrue(promise.catch.called);
    assert.isTrue(res.status.calledWithExactly(200));
    assert.isTrue(res.json.called);

    const spyCall = res.json.getCall(0);
    assert.isObject(spyCall.args[0]);
    assert.sameMembers(Object.keys(spyCall.args[0].response), [
      'status_code',
    ]);
  });
});
