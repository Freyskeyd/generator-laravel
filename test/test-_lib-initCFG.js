/*global describe, it */
'use strict';

var laraCFG = require('../_lib'),
    assert = require('assert'),
    _ = new laraCFG();

describe('_lib', function () {
    describe('initCFG', function () {

        it('should return none empty config object after init', function (done) {
            _.init(function () {
                assert.ok(Object.getOwnPropertyNames(_.getCFG()).length > 0);
                done();
            });
        });

        it('should return a pool containing one path', function (done) {
            _.init(function () {
                _.addPathToPool('/usr/www/test', 'testPath', '');
                _.addPathToPool('usr/www/test2', 'testPath', 'test/debug');
                _.addPathToPool('~/usr/www/test', 'testPath2', 'test/debug');
                _.addPathToPool('~/usr/www/testIN_debug22222', 'testPath2', 'test');
                done();
            });
        });

        it('should remove a path containing in a pool', function (done) {
            _.init(function () {
                _.removePathFromPool('testPath2', 'test/debug');
                done();
            });
        });

        it('should return a pool named test/debug', function (done) {
            _.init(function () {
                var pool = _.poolByName('test/debug');
                if (typeof pool === 'object') {
                    done();
                }
            });
        });

        it('should return a path named testPath in test/debug pool', function (done) {
            _.init(function () {
                var path = _.pathByName('testPath', 'test/debug');

                if (Object.prototype.toString.call(path) === '[object Array]') {
                    done();
                }
            });
        });

        it('should remove a pool named test/debug', function (done) {
            _.init(function () {
                _.removePool('test/debug');
                var pool = _.poolByName('test/debug');

                if (typeof pool === 'undefined') {
                    done();
                }
            });
        });

        it('should add a pool to another pool', function (done) {
            _.init(function () {
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
});