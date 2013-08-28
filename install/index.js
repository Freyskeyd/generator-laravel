'use strict';
var util = require('util');
var fs = require('fs');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');
var chalk = require('chalk');

var yeoman = require('yeoman-generator');

var InstallGenerator = module.exports = function InstallGenerator(args, options, config) {
    // By calling `NamedBase` here, we get the argument to the subgenerator call
    // as `this.name`.
    if (!args.length) { args[0] = './'; }
    yeoman.generators.NamedBase.apply(this, arguments);

    if (options.hasOwnProperty('verbose') && options.verbose) {
        this.verbose = true;
    } else {
        this.verbose = false;
    }

    // TODO :: check last char is /
    this.destinationRoot(this.name);
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


util.inherits(InstallGenerator, yeoman.generators.NamedBase);

InstallGenerator.prototype.help = function help() {

    var helpMessage =
    chalk.white('\n Usage:') +
    chalk.cyan('\n      yo laravel:install DIRECTORY [options]') +
    chalk.white('\n' +
    '\n Options:') +
    chalk.cyan('\n     --help    ') + chalk.white('# Print this message') +
    chalk.cyan('\n     --verbose ') + chalk.white('# More information\n');

    return helpMessage;
};

InstallGenerator.prototype.Clean = function clean() {
    var cb = this.async();


    var prompts = [{
        name: 'answear',
        type: 'confirm',
        message: chalk.yellow('Are you sure about cleaning and installing in ') + this.name + chalk.yellow('?'),
        default: 'Y'
    }];

    this.prompt(prompts, function (props) {
        if (typeof props === 'undefined') {console.log('See ya'.green);
            return false;
        }

        if (props.answear) {
            this.info('Start cleaning directory ('.cyan + this.name.cyan + ')'.cyan);

            var files = fs.readdirSync(this.name);
            var self = this;
            var iteratorElement = files.length;

            if (iteratorElement === 0) {
                self.info('Cleaning done'.green);
                cb();
            }

            var iterator = 0;


            files.forEach(function (item) {
                rimraf(self.name + item, function () {
                    iterator++;
                    self.info(item.yellow + ' Deleted'.red);
                    if (iterator >= iteratorElement) { self.logging('Cleaning done'.green); cb(); }
                });
            });
        } else {
            console.log('See ya'.green);
            return false;
        }
        // this.logging('Check composer install'.cyan);
        // this.logging('Composer is missing'.red, true);
        // this.logging('Install with other method?'.yellow, true);
        // this.logging('Composer has been found'.green);
        // this.logging('Creating new project');
        // this.logging('Laravel has been init');

        //cb();
    }.bind(this));
};

InstallGenerator.prototype.checkComposer = function checkComposer() {
    var cb = this.async();

    this.info('Check composer install'.cyan);
    var composer = spawn('composer'),
        self = this;

    composer.stdout.on('data', function () {
        self.info('Composer has been found'.green);
        self.composer = true;
        cb();
    });

    composer.stderr.on('data', function () {
        self.conflict('Composer is missing'.red, true);
        // Composer doesn't exist
    });
    return false;
};

InstallGenerator.prototype.installComposer = function installComposer() {

    if (this.composer) {
        var composer = spawn('composer', ['create-project', 'laravel/laravel', this.name], {killSignal: 'SIGINT'}),
            self = this;

        composer.stdout.on('data', function (data) {
            self.info('composer : '.green + (data.toString().replace(/\n/g, '')));
        });

        composer.stderr.on('data', function (data) {
            self.conflict('Laravel error '.red + data, true);
            // Composer doesn't exist
        });
        composer.stderr.on('close', function (code) {
            if (!code) {
                self.info('Laravel installed '.green);
            } else {
                self.conflict('Laravel error '.red + code);
            }
        });
    }
};