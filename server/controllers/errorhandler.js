export default class ResponseError{
  static handler(_error, res) {
    let err = new Error('description' in _error ? _error.description : _error);
    err.status = 'httpCode' in _error ? _error.httpCode : 500;
    return res.status(err.status).json({ response: _error });
  }
}
