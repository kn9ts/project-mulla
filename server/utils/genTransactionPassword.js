import moment from 'moment';
import GenEncryptedPassword from './GenEncryptedPassword';

const genTransactionPassword = (req, res, next) => {
  req.timeStamp = moment().format('YYYYMMDDHHmmss'); // In PHP => "YmdHis"
  req.encryptedPassword = new GenEncryptedPassword(req.timeStamp).hashedPassword;
  // console.log('encryptedPassword:', req.encryptedPassword);
  next();
};

export default genTransactionPassword;
