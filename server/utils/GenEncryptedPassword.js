'use strict';
const crypto = require('crypto');


module.exports = class GenEncryptedPassword {
  constructor(timeStamp) {
    const concatenatedString = [
      process.env.PAYBILL_NUMBER,
      process.env.PASSKEY,
      timeStamp,
    ].join('');
    const hash = crypto.createHash('sha256');
    this.hashedPassword = hash.update(concatenatedString).digest('hex'); // or 'binary'
    this.hashedPassword = new Buffer(this.hashedPassword).toString('base64');
  }
};
