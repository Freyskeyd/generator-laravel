/*jshint unused:false */
'use strict';
var util = require('util');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');


var LaravelGenerator = module.exports = function LaravelGenerator(args, options, config) {

  yeoman.generators.Base.apply(this, arguments);
  this.argument('mocha', { type: String, required: false, default: false });

};

util.inherits(LaravelGenerator, yeoman.generators.Base);

/**
 * Public Method
 */
LaravelGenerator.prototype.rootMenu = function () {

  var defaultChoices = this._rootMenuProvider();
  var generatorList = this._.chain(this.pkgs).map(function (generator) {
    if (!generator.appGenerator) {
      return;
    }

    var versionInfo = chalk.gray('(' + generator.version + ')');

    if (generator.updateAvailable) {
      versionInfo += chalk.yellow(' Update Available! ') + chalk.red('(' + generator.update.latest + ')');
    }

    return {
      name: 'Run the ' + generator.prettyName + ' generator ' + versionInfo,
      value: {
        method: '_initGenerator',
        args: generator.namespace
      }
    };
  }).compact().value();

  if (generatorList.length) {
    defaultChoices.unshift({
      name: 'Update your generators',
      value: {
        method: '_updateGenerators'
      }
    });
  }

  var welcome =
  chalk.red('\n   ____') +
  chalk.red('\n   \\   \\            ') + chalk.white('       _____________________') +
  chalk.red('\n    \\   \\      ____ ') + chalk.white('      |  Laravel tools      |') +
  chalk.red('\n     \\   \\     \\   \\ ') + chalk.white('     |                     |') +
  chalk.red('\n      \\___\\_____\\___\\') + chalk.white('     |_____________________|') +
  chalk.red('\n            \\     \\') +
  chalk.red('\n             \\_____\\');
  console.log(welcome);

  this.prompt([{
    name: 'whatNext',
    type: 'list',
    message: 'What would you like to do?',
    choices: this._.union(generatorList, defaultChoices)
  }], function (answer) {
    this[answer.whatNext.method](answer.whatNext.args, function () {});
  }.bind(this));

};

/**
 * Private Method
 */

/**
 * Generate root menu Data
 * @return {Array}
 */
LaravelGenerator.prototype._rootMenuProvider = function () {
  var defaultChoices = [{
      name: 'Install a new Laravel',
      value: {
        method: '_installGenerator'
      }
    },
    // {
    //   name: 'Find some help',
    //   value: {
    //     method: '_findHelp'
    //   }
    // },
    {
      name: 'Get me out of here!',
      value: {
        method: '_noop'
      }
    }
  ];
  return defaultChoices;
};
LaravelGenerator.prototype._noop = function () {
  this.log(chalk.green('See ya\n'));
};
/**
 * Call the install generator
 */
LaravelGenerator.prototype._installGenerator = function () {
  var deps = [
    __dirname + '/../install'
  ];

  var env = yeoman();

  deps.forEach(function (d) {
    if (d instanceof Array) {
      env.register(d[0], d[1]);
    } else {
      env.register(d);
    }
  });

  this.prompt([{
    name: 'where',
    type: 'prompt',
    default: './',
    message: 'Where to install?',
  }], function (answer) {
    var args = [];
    args.push('laravel:install');
    args.push(answer.where);

    env.run(args, {verbose: true}, function () {

    });
  }.bind(this));
};
