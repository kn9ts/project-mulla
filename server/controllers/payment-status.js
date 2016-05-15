import request from 'request';
import moment from 'moment';
import EncryptPassword from './encrypt';
import ParseResponse from './parse-response';


export default class PaymentStatus {
  static constructSOAPBody(data) {
    data.timeStamp = moment().format('YYYYMMDDHHmmss'); // In PHP => "YmdHis"
    data.encryptedPassword = new EncryptPassword(data.timeStamp).hashedPassword;

    let transactionStatusRequest = typeof data.transactionID !== undefined ?
      '<TRX_ID>' + data.transactionID + '</TRX_ID>' :
      '<MERCHANT_TRANSACTION_ID>' + data.merchantTransactionID + '</MERCHANT_TRANSACTION_ID>';

    return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="tns:ns">
      <soapenv:Header>
        <tns:CheckOutHeader>
          <MERCHANT_ID>${process.env.PAYBILL_NUMBER}</MERCHANT_ID>
          <PASSWORD>${data.encryptedPassword}</PASSWORD>
          <TIMESTAMP>${data.timeStamp}</TIMESTAMP>
        </tns:CheckOutHeader>
      </soapenv:Header>
      <soapenv:Body>
        <tns:transactionStatusRequest>
          ${transactionStatusRequest}
        </tns:transactionStatusRequest>
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
        let parsed = new ParseResponse(body, 'transactionstatusresponse');
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
