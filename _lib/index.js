'use strict';

var fs = require('fs'),
    path = require('path'),
    root = path.join(path.dirname(fs.realpathSync(__filename)), '..', '/'),
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

LaravelCFG.prototype.addPathToPool      = function () {};
LaravelCFG.prototype.removePathFromPool = function () {};
LaravelCFG.prototype.addPoolToPool      = function () {};
LaravelCFG.prototype.poolByName         = function () {};
LaravelCFG.prototype.pathByName         = function () {};

// ================================ Pool STOP =======================================

module.exports = LaravelCFG;