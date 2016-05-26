'use strict';

const chai = require('chai');
const assert = chai.assert;

const ucFirst = require('../../server/utils/ucFirst');

describe('ucFirst', () => {
  it('uppercases the 1st letter in the string', () => {
    const string = 'Projectmulla';
    assert.equal(ucFirst(string), 'Projectmulla');
  });

  it('lowercases all the letters in the string after the 1st letter', () => {
    const string = 'proJECTMulLA';
    assert.equal(ucFirst(string), 'Projectmulla');
  });
});
