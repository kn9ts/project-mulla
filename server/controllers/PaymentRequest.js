'use strict';

module.exports = class PaymentRequest {
  constructor(data) {
    this.body = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="tns:ns">
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
          <ENC_PARAMS>${data.extraMerchantPayload ? JSON.stringify(data.extraMerchantPayload) : ''}</ENC_PARAMS>
          <CALL_BACK_URL>${process.env.CALLBACK_URL}</CALL_BACK_URL>
          <CALL_BACK_METHOD>${process.env.CALLBACK_METHOD}</CALL_BACK_METHOD>
          <TIMESTAMP>${data.timeStamp}</TIMESTAMP>
        </tns:processCheckOutRequest>
      </soapenv:Body>
    </soapenv:Envelope>`;
  }

  requestBody() {
    return this.body;
  }
}
