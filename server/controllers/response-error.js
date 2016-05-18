export default function ResponseError(error, res) {
  let err = new Error('description' in error ? error.description : error);
  err.status = 'http_code' in error ? error.http_code : 500;
  return res.status(err.status).json({ response: error });
}
