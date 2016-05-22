'use strict';
const moment = require('moment');
const GenEncryptedPassword = require('./GenEncryptedPassword');


const genTransactionPassword = (req, res, next) => {
  req.timeStamp = moment().format('YYYYMMDDHHmmss'); // In PHP => "YmdHis"
  req.encryptedPassword = new GenEncryptedPassword(req.timeStamp).hashedPassword;
  // console.log('encryptedPassword:', req.encryptedPassword);
  next();
};

module.exports = genTransactionPassword;
