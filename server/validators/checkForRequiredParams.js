'use strict';

module.exports = (req, res, next) => {
  const requiredBodyParams = [
    'referenceID',
    'merchantTransactionID',
    'totalAmount',
    'phoneNumber',
  ];

  if (req.body && 'phoneNumber' in req.body) {
    // validate the phone number
    if (!/\+?(254)[0-9]{9}/g.test(req.body.phoneNumber)) {
      return res.status(400).send('Invalid [phoneNumber]');
    }
  } else {
    return res.status(400).send('No [phoneNumber] parameter was found');
  }

  // validate total amount
  if (req.body && 'totalAmount' in req.body) {
    if (!/^[\d]+(\.[\d]{2})?$/g.test(req.body.totalAmount)) {
      return res.status(400).send('Invalid [totalAmount]');
    }

    if (/^[\d]+$/g.test(req.body.totalAmount)) {
      req.body.totalAmount = (parseInt(req.body.totalAmount, 10)).toFixed(2);
    }
  } else {
    return res.status(400).send('No [totalAmount] parameter was found');
  }

  const bodyParamKeys = Object.keys(req.body);
  const extraPayload = {};

  // anything that is not a required param
  // should be added to the extraPayload object
  for (const key of bodyParamKeys) {
    if (requiredBodyParams.indexOf(key) === -1) {
      extraPayload[key] = req.body[key];
      delete req.body[key];
    }
  }
  req.body.extraPayload = extraPayload;
  // console.log('extraPayload', req.body.extraPayload);
  return next();
};
