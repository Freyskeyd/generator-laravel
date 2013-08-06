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
    });
});