'use strict';

module.exports = function ResponseError(error, res) {
  let err = new Error('description' in error ? error.description : error);
  err.status = 'status_code' in error ? error.status_code : 500;
  return res.status(err.status).json({ response: error });
}
