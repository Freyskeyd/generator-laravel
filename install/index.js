'use strict';
var util   = require('util'),
    fs     = require('fs'),
    path   = require('path'),
    spawn  = require('child_process').spawn,
    rimraf = require('rimraf'),
    chalk  = require('chalk'),
    q      = require('q'),
    _      = require('underscore'),
    yeoman = require('yeoman-generator');

var InstallGenerator = module.exports = function InstallGenerator(args, options) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  if (!args.length) { args[0] = './'; }
  yeoman.generators.NamedBase.apply(this, arguments);

  if (options.hasOwnProperty('verbose') && options.verbose) {
    this.verbose = true;
  } else {
    this.verbose = false;
  }
  this.unix = process.platform !== 'win32';
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

InstallGenerator.prototype.help = function () {

  var helpMessage =
  chalk.white('\n Usage:') +
  chalk.cyan('\n      yo laravel:install DIRECTORY [options]') +
  chalk.white('\n' +
  '\n Options:') +
  chalk.cyan('\n     --help    ') + chalk.white('# Print this message') +
  chalk.cyan('\n     --verbose ') + chalk.white('# More information\n');

  return helpMessage;
};

InstallGenerator.prototype.Clean = function () {
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
      this.info(chalk.cyan('Start cleaning directory (' + process.cwd() + ')'));

      if (!fs.existsSync(process.cwd())) {
        fs.mkdir(process.cwd(), '0755', function () {
          cb();
        });
      } else {
        var files = fs.readdirSync(process.cwd());
        var self = this;
        var iteratorElement = files.length;

        if (iteratorElement === 0) {
          cb();
        }

        var iterator = 0;

        files.forEach(function (item) {
          rimraf(process.cwd() + path.sep + item, function () {
            iterator++;
            self.info(chalk.yellow(item) + chalk.red(' Deleted'));
            if (iterator >= iteratorElement) {
              self.info(chalk.green('Cleaning done'));
              cb();
            }
          });
        });
      }
    } else {
      console.log(chalk.green('See ya'));
      return false;
    }
  }.bind(this));
};

InstallGenerator.prototype.checkComposer = function () {
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

InstallGenerator.prototype.installComposer = function () {
  var cb = this.async();

  if (this.composer) {

    var composer = spawn('composer', ['create-project', 'laravel/laravel', '--prefer-dist', process.cwd()], {killSignal: 'SIGINT'}),
        self = this;

    composer.stdout.on('data', function (data) {
      self.info(chalk.green('composer: ') + (data.toString().replace(/\n/g, '')));
    });

    composer.stderr.on('data', function (data) {
      self.conflict(chalk.red('Laravel error ') + data, true);
      // Composer doesn't exist
    });
    composer.stderr.on('close', function (code) {
      if (!code) {
        self.info(chalk.green('Laravel installed '));
        cb();
      } else {
        self.conflict(chalk.red('Laravel error ') + code);
      }
    });
  }
};

InstallGenerator.prototype._configDb = function (envObject, entity, callback) {

  envObject.db[entity] = {};
    
  this.prompt([{
      type: 'input',
      default: 'localhost',
      name: 'hostname',
      message: chalk.yellow('Host for ') + chalk.blue(entity)
    }, {
      type: 'input',
      default: 'database',
      name: 'database',
      message: chalk.yellow('database name for ') + chalk.blue(entity)
    }, {
      type: 'input',
      default: 'root',
      name: 'username',
      message: chalk.yellow('database username for ') + chalk.blue(entity)
    }, {
      type: 'input',
      default: 'root',
      name: 'password',
      message: chalk.yellow('database password for ') + chalk.blue(entity)
    }], function (responses) {
      envObject.db[entity] = responses;

      callback();
    }.bind(this));
};

InstallGenerator.prototype._defineDb = function (envObject) {
  var cb = this.async();
  envObject.db = {};
  var self = this;
  // Define name
  this.prompt([{
    type: 'checkbox',
    name: 'databaseType',
    default: ['mysql'],
    choices: ['mysql', 'postgres', 'sqlserver'],
    message: chalk.yellow('Check database to configure:')
  }], function (params) {

    // create an empty promise to begin the chain
    var promiseChain = q.fcall(function () {});

    // loop through a variable length list
    // of things to process 
    params.databaseType.forEach(function (entity) {
      var promiseLink = function () {
        var deferred = q.defer();
        this._configDb(envObject, entity, function () {
          deferred.resolve();
        });
        return deferred.promise;
      }.bind(this);

      // add the link onto the chain
      promiseChain = promiseChain.then(promiseLink);
    }.bind(this));
    promiseChain.then(function () {
      this.prompt([{
        type: 'list',
        name: 'defaultDb',
        choices: params.databaseType,
        message: chalk.yellow('default database:')
      }], function (params2) {
        var pathToEnv = 'app' + path.sep + 'config' + path.sep + envObject.name + path.sep;

        var data = {
          defaulttype: params2.defaultDb,
          mysqlhostname: '',
          mysqldatabase: '',
          mysqlusername: '',
          mysqlpassword: '',
          postgreshostname: '',
          postgresdatabase: '',
          postgresusername: '',
          postgrespassword: '',
          sqlserverhostname: '',
          sqlserverdatabase: '',
          sqlserverusername: '',
          sqlserverpassword: ''
        };
        for (var i in envObject) {
          if (_.isObject(envObject[i])) {
            for (var sub in envObject[i]) {
              if (_.isObject(envObject[i][sub])) {
                for (var rSub in envObject[i][sub]) {
                  data[sub + rSub] = envObject[i][sub][rSub];
                }
              }
            }
          }
        }

        self.template('_database.php', pathToEnv + 'database.php', data);
        self.defineEnvironnment();
      });
    }.bind(this));
  }.bind(this));
};

InstallGenerator.prototype._defineEnv = function () {
  var cb = this.async(),
    envObject = {};
  // Define name
  this.prompt([{
    name: 'name',
    message: chalk.yellow('Enter an Environement name:')
  }], function (params) {
    if (params.name === '') {
      cb();
      return false;
    }
    envObject.name = params.name;
    // Create folder in app/config/
    this.mkdir(this.name + path.sep + 'app' + path.sep + 'config' + path.sep + envObject.name);
    this.info(chalk.yellow('Config folder') + chalk.green(' created'));

    
    this._defineDb(envObject);
    // this.template('_database.php', pathToEnv + path.sep + 'database.php');
    // this.info(chalk.yellow('database file') + chalk.green(' generated'));
  }.bind(this));
  
  // Define
};

/**
 * Define environement
 */
InstallGenerator.prototype.defineEnvironnment = function () {
  var cb = this.async(),
      self = this;

  var prompts = [{
    name: 'answear',
    type: 'confirm',
    message: chalk.yellow('Define environments ? '),
    default: 'Y'
  }];

  this.prompt(prompts, function (needEnvironment) {

    if (!needEnvironment.answear) {
      cb();
      return false;
    }
    
    this._defineEnv();

  }.bind(this));
};

InstallGenerator.prototype.next = function () {
  this.info('All done! Bisous');
};