'use strict';

require('../../environment');
const chai = require('chai');
const assert = chai.assert;

const configSetup = require('../../server/config');

describe('Config: index.js', () => {
  it('returns a default config object if one is provided', () => {
    const config = configSetup('staging');
    assert.isObject(config);
    assert.sameMembers(Object.keys(config), ['host', 'expressSessionKey']);
  });

  it('returns a configuration object if it exists', () => {
    const config = configSetup(process.env.NODE_ENV);
    assert.isObject(config);
    assert.sameMembers(Object.keys(config), ['host', 'expressSessionKey']);
  });
});
