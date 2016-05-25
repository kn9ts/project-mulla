'use strict';

const responseError = (error, res) => {
  const descriptionExists = (typeof error === 'object' && 'description' in error);
  const statusCodeExists = (typeof error === 'object' && 'status_code' in error);

  const err = new Error(descriptionExists ? error.description : error);
  err.status = statusCodeExists ? error.status_code : 500;
  return res.status(err.status).json({ response: error });
};

module.exports = responseError;
