/*jshint es5:false, bitwise: true */
'use strict';

var fs = require('fs'),
    path = require('path'),
    _un = require('underscore-contrib'),
    root = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
    cfgFile = path.join(root, '.yolara');


/**
* Constructor
*/
var LaravelCFG = function () {
    this.cfgObject = {};
    this.isInit    = false;
    this.unix      = process.platform !== 'win32';
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

    fs.writeFileSync(cfgFile, JSON.stringify(this.cfgObject, null, 4));
    done.call(self);
};

LaravelCFG.prototype.getCFG     = function () {return this.cfgObject; };
LaravelCFG.prototype.saveCFG    = function (callback) { this.writeCFG(callback); };

// ================================ Config File STOP ================================

// ================================ Pool START ======================================
LaravelCFG.prototype.initPool = function () {
    if (typeof this.cfgObject.pool === 'undefined') {
        this.cfgObject.pool = {};
    }
};

LaravelCFG.prototype.poolList         = function () {
    return this.isInit ? this.cfgObject.pool : null;
};

LaravelCFG.prototype.addPathToPool      = function (_path, name, poolpath) {
    // decompose poolpath
    if (poolpath !== '') {
        poolpath       = poolpath.split('/');
    }

    if (this.unix && ~_path.indexOf('\\')) {
        console.log('Not on a win32 OS');
        return false;
    }
    if (!this.unix && ~_path.indexOf('/')) {
        console.log('Not on a UNIX OS');
        return false;
    }
    if (this.unix) {
        _path = _path.replace('~', process.env.HOME);
    }

    // decompose _path
    _path = _path.split(path.sep);

    // if unix keep first /
    if (this.unix) {
        _path[0] = (_path[0] !== '' ? _path[0] : _path[0] = path.sep);
        if (_path[0] !== path.sep) {

            var sub = process.cwd().split(path.sep);
            for (var i = sub.length - 1; i >= 0; i--) {
                _path.unshift(sub[i]);
            }
            if (_path[0] !== path.sep) {
                _path[0] = path.sep;
            }
        }
    }

    if (typeof poolpath === 'string') {
        if (poolpath === '') {
            poolpath = name;
        } else {
            poolpath += '/' + name;
            poolpath = poolpath.split('/');
        }
    } else {
        poolpath.push(name);
    }

    // Update pool
    this.initPool();
    this.cfgObject.pool = _un.setPath(this.cfgObject.pool, _path, poolpath, {});
    this.saveCFG(function () {});

};
LaravelCFG.prototype.removePathFromPool = function (pathName, poolpath) {
    poolpath = poolpath.split('/');

    var obj = _un.getPath(this.cfgObject.pool, poolpath);

    if (typeof obj !== 'undefined') {
        if (obj.hasOwnProperty(pathName)) {
            delete obj[pathName];
            _un.setPath(this.cfgObject.pool, obj, poolpath);
            this.saveCFG(function () {});
        }
    }
};
LaravelCFG.prototype.addPoolToPool      = function () {};

LaravelCFG.prototype.poolByName         = function (name) {
    return _un.getPath(this.cfgObject.pool, name.split('/'));
};

LaravelCFG.prototype.pathByName         = function (name, pool) {
    var poolpath;
    if (typeof pool === 'string' && pool === '') {
        poolpath = [];
    } else {
        poolpath = pool.split('/');
    }
    poolpath.push(name);
    return _un.getPath(this.cfgObject.pool, poolpath);
};

// ================================ Pool STOP =======================================

module.exports = LaravelCFG;