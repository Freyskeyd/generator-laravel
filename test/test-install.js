/*global describe, it, beforeEach */
'use strict';
require('should');
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('install', function () {
  var laravel;
  var folderName = 'APP';

  beforeEach(function (done) {
    var deps = [
      '../../app',
      '../../install'
    ];
    helpers.testDirectory(path.join(__dirname, folderName), function (err) {
      if (err) {
        done(err);
      }
      laravel = helpers.createGenerator('laravel:install', deps);
      done();
    });
  });

  it('Should return a correct path', function (done) {
    done();
  });

  it('Should return an existing path', function (done) {
    done();
  });

  it('Should clean the directory', function (done) {
    done();
  });
});