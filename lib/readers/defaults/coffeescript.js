'use strict';

/**
 * @private
 * @description CoffeeScript reader for bool.js
 * @param {String} route - The file's route
 * @param {module:booljs~doneCallback} callback - Executes a call to return the
 * code asynchronously
 */
module.exports = function(route, callback){
    try {
        require('coffee-script/register');
        callback(null, require(route));
    } catch(err){
        callback(err);
    }
};
