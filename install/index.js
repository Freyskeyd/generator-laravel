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
      this.info(chalk.cyan('Start cleaning directory (' + this.name + ')'));

      var files = fs.readdirSync(this.name);
      var self = this;
      var iteratorElement = files.length;

      if (iteratorElement === 0) {
        self.info(chalk.green('Cleaning done'));
        cb();
      }

      var iterator = 0;


      files.forEach(function (item) {
        rimraf(self.name + item, function () {
          iterator++;
          self.info(chalk.yellow(item) + chalk.red(' Deleted'));
          if (iterator >= iteratorElement) { self.logging(chalk.green('Cleaning done')); cb(); }
        });
      });
    } else {
      console.log(chalk.green('See ya'));
      return false;
    }
  }.bind(this));
};

InstallGenerator.prototype.checkComposer = function checkComposer() {
  var cb = this.async();

  this.info(chalk.cyan('Check composer install'));
  var composer = spawn('composer'),
      self     = this;

  composer.stdout.on('data', function () {
    self.info(chalk.green('Composer has been found'));
    self.composer = true;
    cb();
  });

  composer.stderr.on('data', function () {
    self.conflict(chalk.red('Composer is missing'), true);
    // Composer doesn't exist
  });
  return false;
};

InstallGenerator.prototype.installComposer = function installComposer() {

  if (this.composer) {
    var composer = spawn('composer', ['create-project', 'laravel/laravel', '--prefer-dist', this.name], {killSignal: 'SIGINT'}),
        self = this;

    composer.stdout.on('data', function (data) {
      self.info(chalk.green('composer : ') + (data.toString().replace(/\n/g, '')));
    });

    composer.stderr.on('data', function (data) {
      self.conflict(chalk.red('Laravel error ') + data, true);
      // Composer doesn't exist
    });
    composer.stderr.on('close', function (code) {
      if (!code) {
        self.info(chalk.green('Laravel installed '));
      } else {
        self.conflict(chalk.red('Laravel error ') + code);
      }
    });
  }
};