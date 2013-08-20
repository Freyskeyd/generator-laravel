'use strict';
var util = require('util'),
    path = require('path'),
    laraCFG = require('../_lib'),
    _ = new laraCFG(),
    yeoman = require('yeoman-generator');

/**
 * Init YoLara CFG
 */
_.init();



var RegisterGenerator = module.exports = function RegisterGenerator(args, options, config) {
    // By calling `NamedBase` here, we get the argument to the subgenerator call
    // as `this.name`.

    yeoman.generators.Base.apply(this, arguments);
    
    /**
     * Arguments
     */
    this.argument('pool', { type: String, required : false, defaults: '' });
    this.argument('name', { type: String, required : false, defaults: path.basename(process.cwd())  });
    this.argument('path', { type: String, required : true, defaults: process.cwd() });
    
    if (options.hasOwnProperty('verbose') && options.verbose) {
        this.verbose = true;
    } else {
        this.verbose = false;
    }
    
    this.logging = function (message, needed) {
        if (this.verbose || needed) {
            console.log(message);
        }
    };
    this.info = function (message, force) {
        if (this.verbose || force) {
            this.log.info(message);
        }
    };
    this.conflict = function (message, force) {
        if (this.verbose || force) {
            this.log.conflict(message);
        }
    };
};

util.inherits(RegisterGenerator, yeoman.generators.Base);

RegisterGenerator.prototype.help = function help() {

    var helpMessage =
    '\n Usage:' +
    '\n      yo laravel:register [PATH] [options]'.cyan +
    '\n' +
    '\n Options:' +
    '\n     --help -h         '.cyan + '# Print this message' +
    '\n     --pool -p [value] '.cyan + '# --pool TEST/debug' +
    '\n     --name -n [value] '.cyan + '# --name testSMS' +
    '\n     --verbose         '.cyan + '# More information\n';

    return helpMessage;
};

RegisterGenerator.prototype.register = function help() {
    // check if pool and name exists
    // warn if already exists
    // add it
};