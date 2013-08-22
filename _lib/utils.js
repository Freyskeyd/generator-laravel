/*jshint es5: false, unused:false */
'use strict';

/**
 * Remove element with mapped arguments
 * @param  {Array} arr Input array
 * @return {Array}
 */
exports.removeA = function (arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
};

/**
 * Clone an object
 * @param  {Object} obj
 * @return {Object}
 */
exports.clone = function (obj) {
    if (null === obj || 'object' !== typeof obj) {
        return obj;
    }
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            copy[attr] = obj[attr];
        }
    }
    return copy;
};

/**
 * Walk an object to set a property
 * @param  {Object} obj   The object
 * @param  {Array} tags  Path to the destination
 * @param  {String} name  Name key
 * @param  {Object} value value associate to the key
 * @return {void}
 */
exports.setDepth = function (obj, tags, name, value) {
    var len = tags.length - 1;

    for (var i = 0; i < len; i++) {
        if (typeof obj[tags[i]] === 'undefined') {
            obj[tags[i]] = {};
        }
        obj = obj[tags[i]];
    }
    if (typeof obj[tags[len]] === 'undefined') {
        obj[tags[len]] = {};
    }
    obj[tags[len]][name] = value;
};