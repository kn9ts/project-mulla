'use strict';

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

// When successfully connected
mongoose.connection.on('connected', () => {
  console.log('Mongoose has connected to the database specified.');
});

// If the connection throws an error
mongoose.connection.on('error', err => {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected on application exit');
    process.exit(0);
  });
});

module.exports = mongoose;
