'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var LaravelGenerator = module.exports = function LaravelGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(LaravelGenerator, yeoman.generators.Base);

LaravelGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

  // welcome message
    var welcome =
  '\n   ____'.red+
  '\n   \\   \\            '.red+'       _____________________'+
  '\n    \\   \\      ____ '.red+'      |  Laravel tools      |'+
  '\n     \\   \\     \\   \\ '.red+'     |                     |'+
  '\n      \\___\\_____\\___\\'.red+'     |_____________________|'+
  '\n            \\     \\'.red+
  '\n             \\_____\\'.red;
                                                                                          

    console.log(welcome);

    var help = '\n Command : '.cyan+
               '\n    -'.white+' laravel:install'.cyan+' : Install a new version of laravel4'.white;
    console.log(help);
};

LaravelGenerator.prototype.app = function app() {
    this.mkdir('app');
    this.mkdir('app/templates');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
};

LaravelGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};
