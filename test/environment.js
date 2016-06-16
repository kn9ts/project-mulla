'use strict';

require('../environment');
const chai = require('chai');
const expect = chai.expect;

describe('environment.js', () => {
  it('Should load default environment vars if environment stage is not defined', () => {
    const envMembers = [
      'API_VERSION',
      'ENDPOINT',
      'SESSION_SECRET_KEY',
      'PAYBILL_NUMBER',
      'PASSKEY',
    ];
    // should have 'MERCHANT_ENDPOINT' if env is not 'development'
    if (process.env.NODE_ENV !== 'development') envMembers.push('MERCHANT_ENDPOINT');
    expect(Object.keys(process.env)).to.include.members(envMembers);
  });
});
