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
    if (typeof done === 'undefined') {
        done = function () {};
    }
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
/**
 * If the pool object isn't init
 * @return void
 */
LaravelCFG.prototype.initPool = function () {
    if (typeof this.cfgObject.pool === 'undefined') {
        this.cfgObject.pool = {};
    }
};

/**
 * return the pool or null
 * @return {Object | null}
 */
LaravelCFG.prototype.poolList         = function () {
    return this.isInit ? this.cfgObject.pool : null;
};

/**
 * Add a path to a pool
 * @param {String} _path    path to add
 * @param {String} name     the name of the path
 * @param {String} poolpath path to the destination pool
 */
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

/**
 * Remove a path element from a pool
 * @param  {String} pathName name of the path
 * @param  {String} poolpath path to the pool
 * @return {void}
 */
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
/**
 * Remove a pool
 * @param  {String} poolpath
 * @return {void}
 */
LaravelCFG.prototype.removePool = function (poolpath) {
    poolpath = poolpath.split('/');
    var last = poolpath[poolpath.length - 1];
    poolpath.pop();

    var obj = _un.getPath(this.cfgObject.pool, poolpath);

    if (typeof obj !== 'undefined') {
        delete obj[last];
        _un.setPath(this.cfgObject.pool, obj, poolpath);
        this.saveCFG(function () {});
    }
};
/**
 * Add a pool to another pool
 * @param {String} pathName     Name of the new pool
 * @param {String} selectedPool Path to the pool to add
 * @param {String} poolpath     Path to the destination pool
 */
LaravelCFG.prototype.addPoolToPool      = function (pathName, selectedPool, poolpath) {
    poolpath     = poolpath.split('/');
    selectedPool = selectedPool.split('/');
    this.initPool();

    var sourcePool = _un.getPath(this.cfgObject.pool, selectedPool);

    if (typeof sourcePool !== 'undefined') {

        var destination = _un.clone(poolpath);

        destination.push(pathName);

        var destinationPool = _un.getPath(this.cfgObject.pool, destination);

        if (typeof destinationPool === 'undefined') {

            this.cfgObject.pool = _un.setPath(this.cfgObject.pool, sourcePool, destination);

            this.saveCFG(function () {});

        } else {
            // destinationPool already exist
        }

    } else {
        // selectedPool is missing
    }
};

/**
 * Get a pool by her name
 * @param  {String} name path to the pool
 * @return {Object}
 */
LaravelCFG.prototype.poolByName         = function (name) {
    return _un.getPath(this.cfgObject.pool, name.split('/'));
};

/**
 * Get a path by his name with pool name
 * @param  {String} name path name
 * @param  {String} pool pool path
 * @return {Array}
 */
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