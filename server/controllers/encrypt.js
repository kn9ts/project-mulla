import crypto from 'crypto';

export default class EncryptedPassword {
  constructor(timeStamp) {
    let concatenatedString = [process.env.PAYBILL_NUMBER, process.env.PASSKEY, timeStamp].join('');
    let hash = crypto.createHash('sha256');
    this.hashedPassword = hash.update(concatenatedString).digest('base64');
    this.hashedPassword = this.hashedPassword.toUpperCase();
  }
}
