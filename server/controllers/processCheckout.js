export default class processCheckOutRequest{
  constructor(data) {
    this.requestBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="tns:ns"><soapenv:Header><tns:CheckOutHeader><MERCHANT_ID>${data.merchantID}</MERCHANT_ID><PASSWORD>${data.encryptedPassword}</PASSWORD><TIMESTAMP>${data.timeStamp}</TIMESTAMP></tns:CheckOutHeader></soapenv:Header><soapenv:Body><tns:processCheckOutRequest><MERCHANT_TRANSACTION_ID>${data.merchantTransactionID}</MERCHANT_TRANSACTION_ID><REFERENCE_ID>${data.referenceID}</REFERENCE_ID><AMOUNT>${data.transcationAmount}</AMOUNT><MSISDN>${data.clientPhoneNumber}</MSISDN><ENC_PARAMS>${data.extraInformation}</ENC_PARAMS><CALL_BACK_URL>${data.callBackURL}</CALL_BACK_URL><CALL_BACK_METHOD>${data.callbackInvocationMethod}</CALL_BACK_METHOD><TIMESTAMP>${data.timeStamp}</TIMESTAMP></tns:processCheckOutRequest></soapenv:Body></soapenv:Envelope>`;
  }
}

// Please note:
// encryptedPassword = base64_encode(CAPITALISE(hash("sha256", $MERCHANT_ID + $passkey + $TIMESTAMP)));
