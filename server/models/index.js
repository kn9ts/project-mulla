// instantiate the database connection
var mongoose = require('../config/database'),
  path = require('path'),
  fs = require('fs'),
  ucFirst = require('../utils/ucfirst'),
  Schema = mongoose.Schema;

// load models
// get all the models from this directory
fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== path.basename(module.filename));
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') {
      return;
    }

    var modelName = file.replace('.js', '');
    module.exports[ucFirst(modelName)] = require(path.join(__dirname, modelName))(mongoose, Schema);
  });

// export connection
module.exports.mongoose = mongoose;
module.exports.Schema = Schema;
