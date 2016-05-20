import moment from 'moment';
import EncryptPassword from '../controllers/encrypt';

const genTransactionPassword = (req, res, next) => {
  req.timeStamp = moment().format('YYYYMMDDHHmmss'); // In PHP => "YmdHis"
  req.encryptedPassword = new EncryptPassword(req.timeStamp).hashedPassword;
  // console.log('encryptedPassword:', req.encryptedPassword);
  next();
};

export default genTransactionPassword;
