'use strict';

const fs = require('fs');
const path = require('path');
const chai = require('chai');
const assert = chai.assert;

const ParseResponse = require('../../server/utils/ParseResponse');
const XMLFile = {
  processCheckoutResponse: '../../docs/responses/2-process-checkout-response.xml',
  transactionConfirmResponse: '../../docs/responses/4-transaction-confirmed.xml',
  transactionCompleteResponse: '../../docs/responses/5-transaction-completed.xml',
};

describe('ParseResponse', () => {
  it('when class is instantiated bodyTagName is defined', () => {
    const parser = new ParseResponse('bodyTagName');
    assert.equal(parser.bodyTagName, 'bodyTagName');
  });

  it('parses a processCheckoutResponse XML response', () => {
    const processCheckoutResponse = fs.readFileSync(
      path.join(__dirname, XMLFile.processCheckoutResponse),
      'utf-8'
    ).replace(/\n\s+/gmi, '');

    const parser = new ParseResponse('processcheckoutresponse');
    const parsedResponse = parser.parse(processCheckoutResponse);
    parsedResponse.toJSON();

    assert.isString(parser.response, 'XML was parsed');
    assert.notMatch(parser.response, /[A-Z]/gm, 'all character are in lowercase');

    assert.isObject(parser.json, 'JSON was extracted');
    assert.includeMembers(Object.keys(parser.json), [
      'return_code',
      'description',
      'trx_id',
      'cust_msg',
    ], 'parsed json has the following properties');
  });

  it('parses a transactionConfirmResponse XML response', () => {
    const transactionConfirmResponse = fs.readFileSync(
      path.join(__dirname, XMLFile.transactionConfirmResponse),
      'utf-8'
    ).replace(/\n\s+/gmi, '');

    const parser = new ParseResponse('transactionconfirmresponse');
    const parsedResponse = parser.parse(transactionConfirmResponse);
    parsedResponse.toJSON();

    assert.isString(parser.response, 'XML was parsed');
    assert.notMatch(parser.response, /[A-Z]/gm, 'all character are in lowercase');

    assert.isObject(parser.json, 'JSON was extracted');
    assert.includeMembers(Object.keys(parser.json), [
      'return_code',
      'description',
      'trx_id',
    ], 'parsed json has the following properties');
  });

  it('parses a transactionCompleteResponse XML response', () => {
    const transactionCompleteResponse = fs.readFileSync(
      path.join(__dirname, XMLFile.transactionCompleteResponse),
      'utf-8'
    ).replace(/\n\s+/gmi, '');

    const parser = new ParseResponse('resultmsg');
    const parsedResponse = parser.parse(transactionCompleteResponse);
    parsedResponse.toJSON();

    assert.isString(parser.response, 'XML was parsed');
    assert.notMatch(parser.response, /[A-Z]/gm, 'all character are in lowercase');

    assert.isObject(parser.json, 'JSON was extracted');
    assert.sameMembers(Object.keys(parser.json), [
      'return_code',
      'status_code',
      'message',
      'msisdn',
      'amount',
      'm-pesa_trx_date',
      'm-pesa_trx_id',
      'trx_status',
      'description',
      'merchant_transaction_id',
      'trx_id',
    ], 'parsed json has the following properties');
  });
});
