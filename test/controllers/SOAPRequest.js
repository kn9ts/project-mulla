'use strict';

require('../../environment');
const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');
const moment = require('moment');
const uuid = require('node-uuid');

const SOAPRequest = require('../../server/controllers/SOAPRequest');
const ParseResponse = require('../../server/utils/ParseResponse');
const paymentRequest = require('../../server/controllers/PaymentRequest');
const GenEncryptedPassword = require('../../server/utils/GenEncryptedPassword');

describe('SOAPRequest', () => {
  const timeStamp = moment().format('YYYYMMDDHHmmss');
  const encryptedPassword = new GenEncryptedPassword(timeStamp).hashedPassword;
  const paymentDetails = {
    referenceID: uuid.v4(),
    merchantTransactionID: uuid.v1(),
    amountInDoubleFloat: '100.00',
    clientPhoneNumber: '254723001575',
    extraPayload: {},
    timeStamp,
    encryptedPassword,
  };

  const parser = new ParseResponse('bodyTagName');
  parser.parse = sinon.stub().returns(parser);
  parser.toJSON = sinon.stub();
  parser.toJSON.onFirstCall().returns({ status_code: 200 });
  parser.toJSON.onSecondCall().returns({ status_code: 400 });

  const soapRequest = new SOAPRequest();
  paymentRequest.buildSoapBody(paymentDetails);
  soapRequest.construct(paymentRequest, parser);

  let requestError = undefined;
  sinon.stub(soapRequest, 'request', (params, callback) => {
    callback(requestError, null, 'a soap dom tree string');
  });

  afterEach(() => {
    requestError = undefined;
  });

  it('SOAPRequest is contructed', () => {
    assert.instanceOf(soapRequest.parser, ParseResponse);
    assert.sameMembers(Object.keys(soapRequest.requestOptions), [
      'method',
      'uri',
      'rejectUnauthorized',
      'body',
      'headers',
    ]);
  });

  it('Invokes then method from a successful response', (done) => {
    const request = soapRequest.post().then((response) => {
      assert.instanceOf(request, Promise);
      assert.isObject(response);
      assert.sameMembers(Object.keys(response), ['status_code']);
      assert.isTrue(soapRequest.parser.parse.called);
      assert.isTrue(soapRequest.parser.toJSON.called);
      assert.isTrue(soapRequest.request.called);
      done();
    });
  });

  it('Invokes catch method from an unsuccessful response', (done) => {
    const request = soapRequest.post().catch((error) => {
      assert.instanceOf(request, Promise);
      assert.isObject(error);
      assert.sameMembers(Object.keys(error), ['status_code']);
      assert.isTrue(soapRequest.parser.parse.called);
      assert.isTrue(soapRequest.parser.toJSON.called);
      assert.isTrue(soapRequest.request.called);
      done();
    });
  });


  it('Invokes catch method if an error is returned on invalid request', (done) => {
    requestError = new Error('invalid URI provided');

    const request = soapRequest.post().catch((error) => {
      assert.instanceOf(request, Promise);
      assert.isObject(error);
      assert.sameMembers(Object.keys(error), ['description']);
      assert.isTrue(soapRequest.parser.parse.called);
      assert.isTrue(soapRequest.parser.toJSON.called);
      assert.isTrue(soapRequest.request.called);
      done();
    });
  });
});
