'use strict';

/**
 * @private
 * @description Javascript reader for bool.js
 * @param {String} route - The file's route
 * @param {module:booljs~doneCallback} callback - Executes a call to return the
 * code asynchronously
 */

module.exports = function(route, callback){
    var API = require('booljs.api');

    try{
        var imported = require(route);
        if(imported !== undefined) return callback(null, imported);
        return callback(new API.Error(
            0, 'EMODNOTFOUND',
            'The required module wasn\'t found'
        ));
    } catch(err){
        callback(err);
    }

};
