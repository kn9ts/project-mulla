import request from 'request';
import moment from 'moment';
import uuid from 'node-uuid';
import EncryptedPassword from './encrypt';


export default class CheckOutRequest {
  static constructSOAPBody(data) {
    data.timeStamp = moment().format('Y-m-d H:mm:s');
    data.encryptedPassword = new EncryptedPassword(data.timeStamp);
    data.merchantTransactionID = uuid.v1(); // time-based
    // data.referenceID // Product, service or order ID

    return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="tns:ns">
      <soapenv:Header>
        <tns:CheckOutHeader>
          <MERCHANT_ID>${process.env.PAYBILL_NUMBER}</MERCHANT_ID>
          <PASSWORD>${data.encryptedPassword}</PASSWORD>
          <TIMESTAMP>${data.timeStamp}</TIMESTAMP>
        </tns:CheckOutHeader>
      </soapenv:Header>
      <soapenv:Body>
        <tns:processCheckOutRequest>
          <MERCHANT_TRANSACTION_ID>${data.merchantTransactionID}</MERCHANT_TRANSACTION_ID>
          <REFERENCE_ID>${data.referenceID}</REFERENCE_ID>
          <AMOUNT>${data.amountInDoubleFloat}</AMOUNT>
          <MSISDN>${data.clientPhoneNumber}</MSISDN>
          <ENC_PARAMS>${data.extraMerchantPayload}</ENC_PARAMS>
          <CALL_BACK_URL>${process.env.CALLBACK_URL}</CALL_BACK_URL>
          <CALL_BACK_METHOD>${process.env.CALLBACK_METHOD}</CALL_BACK_METHOD>
          <TIMESTAMP>${data.timeStamp}</TIMESTAMP>
        </tns:processCheckOutRequest>
      </soapenv:Body>
    </soapenv:Envelope>`;
  }

  static send(body) {
    request({
      'method': 'POST',
      'uri': process.env.ENDPOINT,
      'rejectUnauthorized': false,
      'body': body,
      'headers': {
        'content-type': 'application/xml; charset=utf-8',
      },
    }, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        console.log(body);
      }
    });
  }
}

// Please note:
// encryptedPassword = base64_encode(CAPITALISE(hash('sha256', $MERCHANT_ID + $passkey + $TIMESTAMP)));
