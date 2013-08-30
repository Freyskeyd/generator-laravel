/*global describe, it, beforeEach, after */
'use strict';

var laraCFG = require('../_lib'),
    assert  = require('assert'),
    _       = {};

describe('_lib', function () {
  describe('initCFG', function () {
    beforeEach(function (done) {
      _ = new laraCFG();
      _.test = true;
      _.init(done);
    });

    beforeEach(function (done) {
      _.removeCFGFile(done);
    });

    it('Should return none empty config object after init', function (done) {
      assert.ok(Object.getOwnPropertyNames(_.getCFG()).length > 0);
      done();
    });

    it('Should return a pool containing one path', function (done) {

      _.addPathToPool('/usr/www/test', 'testPath', '');
      _.addPathToPool('usr/www/test2', 'testPath', 'test/debug');
      _.addPathToPool('~/usr/www/test', 'testPath2', 'test/debug');
      _.addPathToPool('~/usr/www/testIN_debug22222', 'testPath2', 'test');

      done();
    });

    it('Should remove a path containing in a pool', function (done) {
      _.removePathFromPool('testPath2', 'test/debug');
      done();
    });

    it('Should return a pool named test/debug', function (done) {
      var pool = _.poolByName('test/debug');
      if (typeof pool === 'object') {
        done();
      }
    });

    it('Should return a path named testPath in test/debug pool', function (done) {
      var path = _.pathByName('testPath', 'test/debug');

      if (Object.prototype.toString.call(path) === '[object Array]') {
        done();
      }
    });

    it('Should remove a pool named test/debug', function (done) {
      _.removePool('test/debug');
      var pool = _.poolByName('test/debug');

      if (typeof pool === 'undefined') {
        done();
      }
    });

    it('Should add a pool to another pool', function (done) {
      _.addPathToPool('~/usr/www/test3', 'testPath3', 'test/debug3/price');
      _.addPathToPool('~/usr/www/test4', 'testPath4', 'test/debug3/qty');

      _.addPoolToPool('testPath5', 'test/debug3/price', 'test/debug3/qty');

      var pool = _.poolByName('test/debug3/qty/testPath5');

      if (typeof pool !== 'undefined') {
        done();
      }
    });
  });
});