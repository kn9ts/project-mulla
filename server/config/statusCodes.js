export default [{
  return_code: 0,
  http_code: 200,
  message: 'Transaction carried successfully'
}, {
  return_code: 9,
  http_code: 400,
  message: 'The merchant ID provided does not exist in our systems'
}, {
  return_code: 10,
  http_code: 400,
  message: 'The phone number(MSISDN) provided isn’t registered on M-PESA'
}, {
  return_code: 30,
  http_code: 400,
  message: 'Missing reference ID'
}, {
  return_code: 31,
  http_code: 400,
  message: 'The request amount is invalid or blank'
}, {
  return_code: 36,
  http_code: 400,
  message: 'Incorrect credentials are provided in the request'
}, {
  return_code: 40,
  http_code: 400,
  message: 'Missing required parameters'
}, {
  return_code: 41,
  http_code: 400,
  message: 'MSISDN(phone number) is in incorrect format'
}, {
  return_code: 32,
  http_code: 401,
  message: 'The merchant/paybill account in the request hasn’t been activated'
}, {
  return_code: 33,
  http_code: 401,
  message: 'The merchant/paybill account hasn’t been approved to transact'
}, {
  return_code: 1,
  http_code: 402,
  message: 'Client has insufficient funds to complete the transaction'
}, {
  return_code: 3,
  http_code: 402,
  message: 'The amount to be transacted is less than the minimum single transfer amount allowed'
}, {
  return_code: 4,
  http_code: 402,
  message: 'The amount to be transacted is more than the maximum single transfer amount allowed'
}, {
  return_code: 8,
  http_code: 402,
  message: 'The client has reached his/her maximum transaction limit for the day'
}, {
  return_code: 35,
  http_code: 409,
  message: 'A duplicate request has been detected'
}, {
  return_code: 43,
  http_code: 409,
  message: "Duplicate merchant transaction ID detected",
}, {
  return_code: 12,
  http_code: 409,
  message: 'The transaction details are different from original captured request details'
}, {
  return_code: 6,
  http_code: 503,
  message: 'Transaction could not be confirmed possibly due to the operation failing'
}, {
  return_code: 11,
  http_code: 503,
  message: 'The system is unable to complete the transaction'
}, {
  return_code: 34,
  http_code: 503,
  message: 'A delay is being experienced while processing requests'
}, {
  return_code: 29,
  http_code: 503,
  message: 'The system is inaccessible; The system may be down'
}, {
  return_code: 5,
  http_code: 504,
  message: 'Duration provided to complete the transaction has expired'
}];
