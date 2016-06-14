'use strict';

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');

const genTransactionPassword = require('../../server/utils/genTransactionPassword');

describe('genTransactionPassword', () => {
  const req = {};
  const next = sinon.spy();

  before(() => {
    genTransactionPassword(req, null, next);
  });

  it('attaches an encryptedPassword property in request object', () => {
    assert.isDefined(req.encryptedPassword, 'encryptedPassword generated');
  });

  it('attaches a timeStamp property in request object', () => {
    assert.isNumber(parseInt(req.timeStamp, 10), 'is numerical');
    assert.lengthOf(req.timeStamp, 14, 'is 14 numbers long');
  });

  it('expect next to have been called', () => {
    expect(next).to.have.been.calledOnce;
  });
});
