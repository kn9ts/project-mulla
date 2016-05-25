'use strict';

require('./environment');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const coveralls = require('gulp-coveralls');
const eslint = require('gulp-eslint');
const runSequence = require('run-sequence').use(gulp);


const paths = {
  serverTests: './tests'
}

gulp.task('lint', () => {
  return gulp.src(['index.js', './server/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('istanbul', ['lint'], () => {
  return gulp.src(['./server/**/*.js', '!node_modules/**'])
    .pipe(istanbul({ includeUntested: true }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test:bend', ['istanbul'], () => {
  return gulp.src(['test/**/*.js'])
    .pipe(mocha({ reporter: 'spec' }))
    .pipe(istanbul.writeReports({
      dir: './coverage',
      reporters: ['html', 'lcov', 'text', 'json']
    }))
    .once('error', (err) => {
      console.log(err);
      process.exit(1);
    })
    .once('end', () => {
      process.exit();
    })
    // .pipe(istanbul.enforceThresholds({
    //   thresholds: {
    //     global: 80,
    //     each: -10
    //   }
    // }));
});

gulp.task('coveralls', () => gulp.src('coverage/lcov.info').pipe(coveralls()));

gulp.task('test', function(callback) {
  runSequence('test:bend', 'coveralls', callback);
});
