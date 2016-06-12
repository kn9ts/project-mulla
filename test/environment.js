'use strict';

require('../environment');
const chai = require('chai');
const expect = chai.expect;

describe('environment.js', () => {
  it('Should load default environment vars if environment stage is not defined', () => {
    // console.log(Object.keys(process.env));
    expect(Object.keys(process.env)).to.include.members([
      'API_VERSION',
      'ENDPOINT',
      'SESSION_SECRET_KEY',
      'PAYBILL_NUMBER',
      'PASSKEY',
      'MERCHANT_ENDPOINT',
    ]);
  });
});
