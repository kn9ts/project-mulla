'use strict';

const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');

const checkForRequiredParams = require('../../server/validators/checkForRequiredParams');

const res = {};
const req = {};
let next = sinon.stub();

describe('checkForRequiredParams', () => {
  beforeEach(() => {
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub();
    next = sinon.stub();
  });

  it('Throws an error if phone number is not provided', () => {
    req.body = {};
    checkForRequiredParams(req, res, next);

    assert.isTrue(res.status.calledWithExactly(400));
    assert.isTrue(res.send.calledOnce);
  });

  it('Throws an error if phone number is not valid', () => {
    req.body = {
      phoneNumber: '0723001575',
    };
    checkForRequiredParams(req, res, next);
    const spyCall = res.send.getCall(0);

    assert.isTrue(res.status.calledWithExactly(400));
    assert.isTrue(res.send.calledOnce);
    assert.isString(spyCall.args[0], 'called with string');
  });

  it('Throws an error if total amount is not provided', () => {
    req.body = {
      phoneNumber: '254723001575',
    };
    checkForRequiredParams(req, res, next);
    const spyCall = res.send.getCall(0);

    assert.isTrue(res.status.calledWithExactly(400));
    assert.isTrue(res.send.calledOnce);
    assert.isString(spyCall.args[0], 'called with string');
  });

  it('Throws an error if total amount is not provided', () => {
    req.body = {
      phoneNumber: '254723001575',
      totalAmount: 'a hundred bob',
    };
    checkForRequiredParams(req, res, next);
    const spyCall = res.send.getCall(0);

    assert.isTrue(res.status.calledWithExactly(400));
    assert.isTrue(res.send.calledOnce);
    assert.isString(spyCall.args[0], 'called with string');
  });

  it('Converts a whole number into a number with double floating points', () => {
    req.body = {
      phoneNumber: '254723001575',
      totalAmount: '100',
    };
    checkForRequiredParams(req, res, next);

    assert.equal(res.status.callCount, 0);
    assert.equal(res.send.callCount, 0);
    assert.isNumber(parseInt(req.body.totalAmount, 100), 'should be 100.00');
  });

  it('Next is returned if everything is valid', () => {
    req.body = {
      phoneNumber: '254723001575',
      totalAmount: '100.00',
    };
    checkForRequiredParams(req, res, next);

    assert.equal(res.status.callCount, 0);
    assert.equal(res.send.callCount, 0);
    assert.isTrue(next.calledOnce);
    assert.isDefined(req.body.extraPayload);
  });

  it('Other params are moved into extraPayload property', () => {
    req.body = {
      phoneNumber: '254723001575',
      totalAmount: '100.00',
      userID: 1515,
      location: 'Kilimani',
    };
    checkForRequiredParams(req, res, next);

    assert.isDefined(req.body.extraPayload);
    assert.sameMembers(Object.keys(req.body.extraPayload), ['userID', 'location']);
  });
});
