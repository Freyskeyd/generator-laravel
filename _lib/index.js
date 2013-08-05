'use strict';

var fs = require('fs'),
path = require('path'),
root = path.join(path.dirname(fs.realpathSync(__filename)), '..', '/'),
cfgFile = path.join(root, '.yolara'),
cfgObject = {};

/**
* Constructor
*/
var LaravelCFG = function () {

};
/**
* Do Some initialisation on system
* Get/Create cfg file
* Unix Support only
* @return null
*/
LaravelCFG.prototype.init = function () {

    if (!fs.existsSync(cfgFile)) {
        console.log('LaravelCFG :: config file dosn\'t exists');

        this.openCFGFile(function (fd) {
            this.setDefaultCFG(fd);
        });

    } else {
        this.readCFGFile();
    }
};

/**
* Read CFG File
*/
LaravelCFG.prototype.readCFGFile = function () {
    var self = this;
    fs.readFile(cfgFile, 'utf8', function (err, buffer) {
        if (err) { throw err; }
        var data = buffer.toString('utf8');
        if (!data.length) {
            cfgObject = self.setDefaultCFG();
        }
    });
};

/**
* OpenCFGfile
* @param  callback Closure
*/
LaravelCFG.prototype.openCFGFile = function (callback) {
    var self = this;
    fs.open(cfgFile, 'w+', function (err, fd) {
        if (err) { throw err; }
        callback.call(self, fd);
    });
};

/**
* Set default CFG in config file
* @return Object Config
*/
LaravelCFG.prototype.setDefaultCFG = function () {

};
module.exports = LaravelCFG;