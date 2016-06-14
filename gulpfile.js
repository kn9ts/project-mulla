'use strict';

require('./environment');
const os = require('os');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const coveralls = require('gulp-coveralls');
const eslint = require('gulp-eslint');
const runSequence = require('run-sequence');

if (!('COVERALLS_SERVICE_NAME' in process.env)) {
  process.env.COVERALLS_SERVICE_NAME = `${os.hostname()}.${os.platform()}-${os.release()}`;
}
process.env.COVERALLS_REPO_TOKEN = 'EI2vRz1HRhJ3pGi7g3J6sMxI4dsnrWxtb';

const filesToLint = [
  'gulpfile.js',
  'index.js',
  'environment.js',
  './server/**/*.js',
  '!node_modules/**',
];

gulp.task('lint', () => gulp.src(filesToLint)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

gulp.task('coverage', () => gulp
  .src(['!node_modules/**', '!server/routes/**', './server/**/*.js'])
  .pipe(istanbul({ includeUntested: true }))
  .pipe(istanbul.hookRequire()));

gulp.task('test:backend', () => gulp.src(['test/**/*.js'])
  .pipe(mocha({ reporter: 'spec' }))
  .once('error', err => {
    throw err;
  })
  .pipe(istanbul.writeReports({
    dir: './coverage',
    reporters: ['html', 'lcov', 'text', 'json'],
  })));

gulp.task('coveralls', () => gulp.src('coverage/lcov.info').pipe(coveralls()));

gulp.task('test', callback => {
  runSequence('lint', 'coverage', 'test:backend', callback);
});
