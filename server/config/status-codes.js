export default [{
  returnCode: 0,
  httpCode: 200,
  message: 'Everthing went well'
}, {
  returnCode: 9,
  httpCode: 400,
  message: 'The merchant ID provided does not exist in our systems'
}, {
  returnCode: 10,
  httpCode: 400,
  message: 'The phone number(MSISDN) provided isn’t registered on M-PESA'
}, {
  returnCode: 30,
  httpCode: 400,
  message: 'Missing reference ID'
}, {
  returnCode: 31,
  httpCode: 400,
  message: 'The request amount is invalid or blank'
}, {
  returnCode: 36,
  httpCode: 400,
  message: 'Incorrect credentials are provided in the request'
}, {
  returnCode: 40,
  httpCode: 400,
  message: 'Missing required parameters'
}, {
  returnCode: 41,
  httpCode: 400,
  message: 'MSISDN(phone number) is in incorrect format'
}, {
  returnCode: 32,
  httpCode: 401,
  message: 'The merchant/paybill account in the request hasn’t been activated'
}, {
  returnCode: 33,
  httpCode: 401,
  message: 'The merchant/paybill account hasn’t been approved to transact'
}, {
  returnCode: 1,
  httpCode: 402,
  message: 'Client has insufficient funds to complete the transaction'
}, {
  returnCode: 3,
  httpCode: 402,
  message: 'The amount to be transacted is less than the minimum single transfer amount allowed'
}, {
  returnCode: 4,
  httpCode: 402,
  message: 'The amount to be transacted is more than the maximum single transfer amount allowed'
}, {
  returnCode: 8,
  httpCode: 402,
  message: 'The client has reached his/her maximum transaction limit for the day'
}, {
  returnCode: 35,
  httpCode: 409,
  message: 'A duplicate request has been detected'
}, {
  returnCode: 12,
  httpCode: 409,
  message: 'The transaction details are different from original captured request details'
}, {
  returnCode: 6,
  httpCode: 503,
  message: 'Transaction could not be confirmed possibly due to the operation failing'
}, {
  returnCode: 11,
  httpCode: 503,
  message: 'The system is unable to complete the transaction'
}, {
  returnCode: 34,
  httpCode: 503,
  message: 'A delay is being experienced while processing requests'
}, {
  returnCode: 29,
  httpCode: 503,
  message: 'The system is inaccessible; The system may be down'
}, {
  returnCode: 5,
  httpCode: 504,
  message: 'Duration provided to complete the transaction has expired'
}];
