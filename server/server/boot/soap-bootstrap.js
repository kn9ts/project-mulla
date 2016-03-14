var loopback = require('loopback');
var path = require('path');

// This script bootstraps the SOAP to REST configurations
// Much more can be done, for now still figuring how
module.exports = function(app, callback) {

  var ds = loopback.createDataSource('soap', {
    connector: require('loopback-connector-soap'),
    remotingEnabled: true,
    url: 'https://safaricom.co.ke/mpesa_online/lnmo_checkout_server.php?wsdl',
    wsdl: path.join(__dirname, '../../../Checkout.wsdl'),
    soapHeaders: [{
      element: {
        CheckOutHeader: {
          MERCHANT_ID: 283980,
          PASSWORD: 'ankld7344kj4klj4lkdjl',
          TIMESTAMP: 20141128174717
        },
      },
      prefix: 'tns', // The XML namespace prefix for the header
    }],
    soapBody: [{
      element: {
        processCheckOutRequest: null
      },
      prefix: 'tns:ns'
    }]
  });

  // console.log('DS: ', Object.keys(ds));

  // Unfortunately, the methods from the connector are mixed in asynchronously
  // This is a hack to wait for the methods to be injected
  ds.once('connected', function() {

    // Set up a before-execute
    // This way we get to clean the SOAP/XML POST body before being
    // posted to the SAG
    ds.connector.observe('before execute', function(ctx, next) {

      ctx.req.body = ctx.req.body
        .replace(/(soap)(\:|\=)/gi, function(match, p1, p2) {
          return 'soapenv' + p2;
        })
        .replace(/(process|transact|CheckOutHeader)/g, function(match, p1) {
          return 'tns:' + p1;
        })
        .replace('<?xml version="1.0" encoding="utf-8"?>', '')
        .replace('xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"', '');

      console.log('================ REQUEST: ===================\n\n', ctx.req);
      next();

    });

    var checkoutInfo = {
      MERCHANT_TRANSACTION_ID: '12938092380',
      REFERENCE_ID: '233223',
      MSISDN: '0723001575',
      ENC_PARAMS: 'Some extra information here',
      AMOUNT: 900.00,
      CALL_BACK_URL: './callback/here',
      CALL_BACK_METHOD: 'POST',
      // TIMESTAMP: '20141128174717'
    };

    var confirmTransaction = {
      MERCHANT_TRANSACTION_ID: '12938092380'
    };

    // Create the model
    var mPesa = ds.createModel('mPesa', {});

    // Refine the methods
    mPesa.checkout = function(MerchantID, password, cb) {
      mPesa.processCheckOut(checkoutInfo, function(err, response) {
        console.log('\n================ Response: ================\n\n %j', response);
        cb(err, response ? response : { response: null });
      });

      // TODO: Move to it's own method
      // mPesa.confirmTransaction(confirmTransaction, function(err, response) {
      //   console.log('Response: %j', response);
      //   cb(err, result);
      // });
    };

    var MerchantID = {
      arg: 'MerchantID',
      type: 'string',
      required: true,
      http: {
        source: 'query'
      }
    };

    var password = {
      arg: 'password',
      type: 'string',
      required: true,
      http: {
        source: 'query'
      }
    };

    // Map to REST/HTTP
    loopback.remoteMethod(mPesa.checkout, {
      accepts: [MerchantID, password],
      returns: {
        type: 'object',
        root: true
      },
      http: {
        verb: 'get',
        path: '/checkout'
      }
    });

    // Expose to REST
    app.model(mPesa);
    callback();

  });
};

