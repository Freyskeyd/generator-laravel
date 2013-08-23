/*global describe, it, beforeEach */
'use strict';
var laravel = require('..');
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
            laravel.options['skip-install'] = true;
            done();
        });
    });

    it('should display help', function (done) {
        laravel.run({}, function () {
        });
        done();
    });
});