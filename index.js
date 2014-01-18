
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
        return
    }
    obj.__thunked__ = true

    var keys = Object.keys(obj)

    keys.forEach(function(key) {

        var subobj = obj[key]
        if (typeof subobj == "object") {

            thunkRecurse(subobj)
            
        } else if (typeof subobj == "function") {
            
            if (obj["co"+key]) {
                console.log("Could not thunkify function '"+key+"' due to the property 'co"+key+"' already being set")
            } else {
                obj["co"+key] = thunkify(obj[key])
            }

        }

    })

}

/**
 * Wrap all functions in the named module as thunks.
 *
 * @param {String} name
 * @return {Object}
 * @api public
 */

function trequire(name) {

    var module = require(name)

    thunkRecurse(module)
    
    return module

}
