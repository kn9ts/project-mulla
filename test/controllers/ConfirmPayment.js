'use strict';

require('../../environment');
const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');
const moment = require('moment');
const uuid = require('node-uuid');

const confirmPayment = require('../../server/controllers/ConfirmPayment');
const GenEncryptedPassword = require('../../server/utils/GenEncryptedPassword');

describe('confirmPayment', () => {
  const timeStamp = moment().format('YYYYMMDDHHmmss');
  const encryptedPassword = new GenEncryptedPassword(timeStamp).hashedPassword;
  const params = {
    transactionID: uuid.v1(),
    timeStamp,
    encryptedPassword,
  };

  const req = {};
  req.timeStamp = timeStamp;
  req.encryptedPassword = encryptedPassword;
  req.params = {
    id: uuid.v1(),
  };

  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub();

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

  beforeEach(() => {
    promise.then.reset();
    promise.catch.reset();
  });

  confirmPayment.parser = sinon.stub().returnsThis();
  confirmPayment.soapRequest.construct = sinon.stub().returnsThis();
  confirmPayment.soapRequest.post = sinon.stub().returns(promise);

  it('BuildSoapBody builds the soap body string with transactionID', () => {
    confirmPayment.buildSoapBody(params);

    assert.isString(confirmPayment.body);
    assert.match(confirmPayment.body, /(TRX_ID)/);
    assert.notMatch(confirmPayment.body, /(MERCHANT_TRANSACTION_ID)/);
    assert.match(confirmPayment.body, /(soapenv:Envelope)/gi);
  });

  it('if transactionID is not provide soap body built with merchantTransactionID', () => {
    delete params.transactionID;
    params.merchantTransactionID = uuid.v4();
    confirmPayment.buildSoapBody(params);

    assert.isString(confirmPayment.body);
    assert.match(confirmPayment.body, /(MERCHANT_TRANSACTION_ID)/);
    assert.notMatch(confirmPayment.body, /(TRX_ID)/);
    assert.match(confirmPayment.body, /(soapenv:Envelope)/gi);
  });

  it('Makes a SOAP request and returns a promise', () => {
    confirmPayment.buildSoapBody = sinon.stub();
    // const confirmPaymentHandler = sinon.spy(confirmPayment, 'handler');
    confirmPayment.handler(req, res);

    assert.isTrue(confirmPayment.buildSoapBody.called);
    assert.isTrue(confirmPayment.soapRequest.construct.called);
    assert.isTrue(confirmPayment.soapRequest.post.called);

    assert.isFalse(promise.then.called);
    assert.isFalse(promise.catch.called);
  });
});
