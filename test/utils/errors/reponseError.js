'use strict';

const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');

const responseError = require('../../../server/utils/errors/responseError');

describe('responseError', () => {
  let spyCall;
  const res = {};
  let error = 'An error message';

  beforeEach(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub();

    responseError(error, res);
  });

  it('Calls response method with default(500) error code', () => {
    spyCall = res.status.getCall(0);
    assert.isTrue(res.status.calledOnce);
    assert.isTrue(spyCall.calledWithExactly(500));
  });

  it('Returns error wrapped in json response', () => {
    spyCall = res.json.getCall(0);
    assert.isTrue(res.json.calledOnce);
    assert.isObject(spyCall.args[0]);
    assert.property(spyCall.args[0], 'response', 'status');
  });

  it('Calls response method with custom error code', () => {
    error = {
      description: 'Bad request',
      status_code: 400,
    };
    responseError(error, res);
    spyCall = res.status.getCall(0);
    assert.isTrue(res.status.called);
    assert.isTrue(res.status.calledWithExactly(400));
  });
});
