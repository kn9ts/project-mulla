// instantiate the database connection
import mongoose from '../config/database';
import path from 'path';
import fs from 'fs';
import ucFirst from '../utils/ucfirst';

const Schema = mongoose.Schema;

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
export default { mongoose, Schema };
