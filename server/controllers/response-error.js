export default function ResponseError(_error, res) {
  let err = new Error('description' in _error ? _error.description : _error);
  err.status = 'http_code' in _error ? _error.http_code : 500;
  return res.status(err.status).json({ response: _error });
}
