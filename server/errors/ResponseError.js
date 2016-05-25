'use strict';

const responseError = (error, res) => {
  const err = new Error('description' in error ? error.description : error);
  err.status = 'status_code' in error ? error.status_code : 500;
  return res.status(err.status).json({ response: error });
};

module.exports = responseError;
