'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var DoctorGenerator = module.exports = function DoctorGenerator(args, options, config) {
    // By calling `NamedBase` here, we get the argument to the subgenerator call
    // as `this.name`.
    yeoman.generators.NamedBase.apply(this, arguments);

};

util.inherits(DoctorGenerator, yeoman.generators.NamedBase);

/*
    
    Control project existance
    Control command line tool
        Run composer diagnose
        Run composer valdidate
        Run composer migrate status
        Run Grunt tests
 */