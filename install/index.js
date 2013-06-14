'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var InstallGenerator = module.exports = function InstallGenerator(args, options, config) {
    // By calling `NamedBase` here, we get the argument to the subgenerator call
    // as `this.name`.
    yeoman.generators.NamedBase.apply(this, arguments);


    if (options.hasOwnProperty('verbose') && options.verbose) {
        this.verbose = true;
    } else {
        this.verbose = false;
    }
    this.name = typeof this.name === 'undefined' ? '.' : this.name;

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
};


util.inherits(InstallGenerator, yeoman.generators.NamedBase);

InstallGenerator.prototype.help = function help() {

    var helpMessage =
    '\n Usage:' +
    '\n      yo laravel:install DIRECTORY [options]'.cyan +
    '\n' +
    '\n Options:' +
    '\n     --help    '.cyan + '# Print this message' +
    '\n     --verbose '.cyan + '# More information\n';

    return helpMessage;
};


InstallGenerator.prototype.Clean = function clean() {
    var cb = this.async();
    var prompts = [{
        name: 'answear',
        type: 'confirm',
        message: 'Are you sure about cleaning and installing in '.yellow + this.name + '?'.yellow,
        default: 'Y'
    }];

    this.prompt(prompts, function (err, props) {
        if (props.answear.toUpperCase() === 'Y') {
            this.info('Start cleaning directory ('.cyan + this.name.cyan + ')'.cyan);
            this.removeScript(this.name + '/*', function () {
                console.log('ok');
            });
        } else {
            console.log('See ya'.green);
            return false;
        }
        // this.logging('Cleaning done'.green);
        // this.logging('Check composer install'.cyan);
        // this.logging('Composer is missing'.red, true);
        // this.logging('Install with other method?'.yellow, true);
        // this.logging('Composer has been found'.green);
        // this.logging('Creating new project');
        // this.logging('Laravel has been init');

        cb();
    }.bind(this));
};
InstallGenerator.prototype.install = function install() {
    console.log('start install');
};