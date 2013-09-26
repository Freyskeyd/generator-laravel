/*global describe, it, beforeEach */
'use strict';
require('should');
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('app', function () {
  var laravel;
  var folderName = 'APP';

  beforeEach(function (done) {
    var deps = [
      '../../app',
      '../../install',
      '../../doctor'
    ];
    helpers.testDirectory(path.join(__dirname, folderName), function (err) {
      if (err) {
        done(err);
      }
      laravel = helpers.createGenerator('laravel:app', deps);
      done();
    });
  });

  it('Should produce a valid menu', function () {
    var rootMenu = laravel._rootMenuProvider();
    rootMenu.length.should.equal(2);
  });
});