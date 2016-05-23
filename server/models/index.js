'use strict';

const mongoose = require('../config/database');
const path = require('path');
const fs = require('fs');
const ucFirst = require('../utils/ucfirst');
const Schema = mongoose.Schema;


// load models
fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) &&
      (file !== path.basename(module.filename));
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    let modelName = file.replace('.js', '');
    let modelPath = path.join(__dirname, modelName)
    module.exports[ucFirst(modelName)] = require(modelPath)(mongoose, Schema);
  });

// export connection
module.exports = { mongoose, Schema };
