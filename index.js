
/**
 * Expose `trequire()`.
 */

module.exports = trequire

/**
 * Require `thunkify()`
 */

var thunkify = require('thunkify')

/**
 * Inner method that recursively `thunkify`s all functions in a module.
 * It does not replace the original function, rather it returns alternatives
 * prefixed with `co`. It does no checking to see whether or not a function
 * takes a callback, so sometimes the alternate functions won't actually
 * be useful for anything at all.
 *
 * @param {Object} obj
 * @api private
 */

function thunkRecurse(obj) {

    if (!obj || obj.__thunked__) {
        return;
    }
    obj.__thunked__ = true;

    var keys = [
        'prototype'
    ];
    for (key in obj) {
        keys.push(key);
    }

    for (var i = 0, len = keys.length; i < len; i++) {

        try {

            var key = keys[i];

            if (!obj[key]) {
                continue;
            }

            var isFunc = typeof obj[key] == "function";
            var isObj = typeof obj[key] == "object";

            if (isFunc) {

                if (!obj["co"+key]) {
                    obj["co"+key] = thunkify(obj[key]);
                }

            }

            if (isFunc || isObj) {

                    thunkRecurse(obj[key]);

            }

        } catch (e) {
            // fail without correcting, not everything wants to be thunked this way
        }

    }

}

/**
 * Inner method that removes thunked property so other modules that might
 * expand on previously thunked code don't get messed up.
 *
 * @param {Object} obj
 * @api private
 */

function removeThunkedProperty(obj) {

    if (!obj || !obj.__thunked__) {
        return;
    }
    delete obj.__thunked__;

    var keys = [
        'prototype'
    ];
    for (key in obj) {
        keys.push(key);
    }

    for (var i = 0, len = keys.length; i < len; i++) {

        try {

            var key = keys[i];

            if (!obj[key]) {
                continue;
            }

            var isFunc = typeof obj[key] == "function";
            var isObj = typeof obj[key] == "object";

            if (isFunc || isObj) {

                removeThunkedProperty(obj[key]);

            }

        } catch (e) {
            // fail without correcting, not everything wants to be thunked this way
        }

    }

}

/**
 * Wrap all functions in the named module as thunks.
 *
 * @param {String} name
 * @return {Object}
 * @api public
 */

function trequire(nameOrModule) {

    var module;
    if (typeof nameOrModule == "string") {
        try {
            module = require('../'+nameOrModule);
        } catch (e) {
            module = require(nameOrModule);
        }
    } else {
        module = nameOrModule
    }

    thunkRecurse(module);
    removeThunkedProperty(module);

    return module;

}
