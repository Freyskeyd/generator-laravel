'use strict';
var util = require('util'),
    laraCFG = require('../_lib'),
    _ = new laraCFG(),
    yeoman = require('yeoman-generator');

/**
 * Init YoLara CFG
 */
_.init();



var DoctorGenerator = module.exports = function DoctorGenerator(args, options, config) {
    // By calling `NamedBase` here, we get the argument to the subgenerator call
    // as `this.name`.


    yeoman.generators.Base.apply(this, arguments);
    /**
     * Arguments
     */
    this.argument('group', { type: String, required: false });
    this.argument('name', { type: String, required: false });

    if (options.hasOwnProperty('verbose') && options.verbose) {
        this.verbose = true;
    } else {
        this.verbose = false;
    }

    this.composer = false;

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

util.inherits(DoctorGenerator, yeoman.generators.Base);


DoctorGenerator.prototype.help = function help() {

    var helpMessage =
    '\n Usage:' +
    '\n      yo laravel:doctor [options]'.cyan +
    '\n' +
    '\n Options:' +
    '\n     --help            '.cyan + '# Print this message' +
    '\n     --verbose         '.cyan + '# More information'+
    '\n     --all 	       '.cyan + '# For all directory listed in all group'+
    '\n     --group GROUPNAME '.cyan +'# For a particular group\n';

    return helpMessage;
};

/**
 * Control project existance
 * @return nil
 */
DoctorGenerator.prototype.existance = function existance() {
    
};

/**
 * Run composer diagnose
 * @return nil
 */
DoctorGenerator.prototype.composerDiagnose = function composerDiagnose() {

};

/**
 * Run migrate status
 * @return nil
 */
DoctorGenerator.prototype.migrateStatus = function migrateStatus(){

};

/**
 * Run Grunt tests
 * @return nil
 */
DoctorGenerator.prototype.gruntTests = function gruntTests(){

};