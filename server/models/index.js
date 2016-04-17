// instantiate the database connection
var mongoose = require('../config/database'),
  path = require('path'),
  ucFirst = require('../utils/ucfirst'),
  Schema = mongoose.Schema;

// load models
var models = [];

if (models.length > 0) {
  // add them to be exported in one go
  models.forEach(function(model) {
    module.exports[ucFirst(model)] = require(path.join(__dirname, model))(mongoose, Schema);
  });
}

// export connection
module.exports.mongoose = mongoose;
module.exports.Schema = Schema;
