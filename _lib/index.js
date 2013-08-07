/*jshint es5:false, bitwise: true */
'use strict';

var fs = require('fs'),
    path = require('path'),
    utils = require('./utils'),
    root = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
    cfgFile = path.join(root, '.yolara');


/**
* Constructor
*/
var LaravelCFG = function () {
    this.cfgObject  = {};
    this.isInit     = false;
};

/**
* Do Some initialisation on system
* Get/Create cfg file
* Unix Support only
* @return null
*/
LaravelCFG.prototype.init = function (done) {

    if (!fs.existsSync(cfgFile)) {
        console.log('LaravelCFG :: config file dosn\'t exists');

        this.openCFGFile(function () {

            this.setDefaultCFG(function () {
                this.readCFGFile(done);
            });
        });

    } else {
        this.readCFGFile(done);
    }
};

// ================================ Config File START ===============================

/**
* Read CFG File
*/
LaravelCFG.prototype.readCFGFile = function (done) {
    var self = this;
    fs.readFile(cfgFile, 'utf8', function (err, buffer) {
        if (err) { throw err; }
        var data = buffer.toString('utf8');
        if (!data.length) {
            self.cfgObject  = JSON.parse(self.setDefaultCFG(done));
            self.isInit     = true;
        } else {
            self.cfgObject  = JSON.parse(data);
            self.isInit     = true;
            done();
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
LaravelCFG.prototype.setDefaultCFG = function (done) {
    this.cfgObject.lastUpdate   = new Date().getTime();
    this.cfgObject.author       = 'Simon PAITRAULT';

    this.writeCFG(done);
};

/**
 * Write into CFG file
 */
LaravelCFG.prototype.writeCFG = function (done) {
    var self = this;

    fs.writeFile(cfgFile, JSON.stringify(this.cfgObject, null, 4), function (err) {
        if (err) {
            console.log(err);
        } else {
            done.call(self);
        }
    });
};

LaravelCFG.prototype.getCFG     = function () {return this.cfgObject; };
LaravelCFG.prototype.saveCFG    = function (callback) { this.writeCFG(callback); };

// ================================ Config File STOP ================================

// ================================ Pool START ======================================
LaravelCFG.prototype.poolList         = function () {
    return this.isInit ? this.cfgObject.pool : null;
};

LaravelCFG.prototype.addPathToPool      = function (_path, name, poolpath) {
    // decompose poolpath
    poolpath       = poolpath.split('/');

    if (process.platform !== 'win32' && ~_path.indexOf('\\')) {
        console.log('Not on a win32 OS');
        return false;
    }
    if (process.platform === 'win32' && ~_path.indexOf('/')) {
        console.log('Not on a UNIX OS');
        return false;
    }

    // decompose _path
    _path = _path.split(path.sep);

    console.log(_path);
    // var loopNumber = poolpath.length;

    // if (typeof this.cfgObject.pool === 'undefined') { this.cfgObject.pool = {}; }

    // var copyPool = utils.clone(this.cfgObject.pool);

    // for (var i = 0; i < loopNumber; i++) {
    //     console.log(poolpath[i]);
    // }
};
LaravelCFG.prototype.removePathFromPool = function () {};
LaravelCFG.prototype.addPoolToPool      = function () {};
LaravelCFG.prototype.poolByName         = function () {};
LaravelCFG.prototype.pathByName         = function () {};

// ================================ Pool STOP =======================================

module.exports = LaravelCFG;