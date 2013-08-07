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
                _.addPathToPool('C:\\usr\\test', 'testPath', 'test/debug');
                done();
            });
        });
    });
});