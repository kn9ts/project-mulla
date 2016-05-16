import request from 'request';
import moment from 'moment';
import EncryptPassword from './encrypt';
import ParseResponse from './parse-response';


export default class PaymentRequest {
  static construct(data) {
    data.timeStamp = moment().format('YYYYMMDDHHmmss'); // In PHP => "YmdHis"
    data.encryptedPassword = new EncryptPassword(data.timeStamp).hashedPassword;

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
          <ENC_PARAMS>${(data.extraMerchantPayload || '')}</ENC_PARAMS>
          <CALL_BACK_URL>${process.env.CALLBACK_URL}</CALL_BACK_URL>
          <CALL_BACK_METHOD>${process.env.CALLBACK_METHOD}</CALL_BACK_METHOD>
          <TIMESTAMP>${data.timeStamp}</TIMESTAMP>
        </tns:processCheckOutRequest>
      </soapenv:Body>
    </soapenv:Envelope>`;
  }

  static send(soapBody) {
    return new Promise((resolve, reject) => {
      request({
        'method': 'POST',
        'uri': process.env.ENDPOINT,
        'rejectUnauthorized': false,
        'body': soapBody,
        'headers': {
          'content-type': 'application/xml; charset=utf-8'
        }
      }, (err, response, body) => {
        if (err) {
          reject(err);
          return;
        }

        // console.log('RESPONSE: ', body);
        let parsed = new ParseResponse(body, 'processcheckoutresponse');
        let json = parsed.toJSON();

        if (json.httpCode !== 200) {
          reject(json);
          return;
        }
        resolve(json);
      });
    });
  }
}
