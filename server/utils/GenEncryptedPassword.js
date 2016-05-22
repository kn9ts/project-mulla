'use strict';
const crypto = require('crypto');


module.exports = class GenEncryptedPassword {
  constructor(timeStamp) {
    let concatenatedString = [process.env.PAYBILL_NUMBER, process.env.PASSKEY, timeStamp].join('');
    let hash = crypto.createHash('sha256');
    this.hashedPassword = hash.update(concatenatedString).digest('hex'); // or 'binary'
    this.hashedPassword = new Buffer(this.hashedPassword).toString('base64');
    // this.hashedPassword = this.hashedPassword.toUpperCase();
    // console.log('hashedPassword ==> ', this.hashedPassword);
  }
}
