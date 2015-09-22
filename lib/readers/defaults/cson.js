'use strict';

/**
 * @private
 * @description CSON reader for bool.js
 * @param {String} route - The file's route
 * @param {module:booljs~doneCallback} callback - Executes a call to return the
 * data asynchronously
 */
module.exports = function(route, callback){
    var cson = require('cson');
    cson.parseCSONFile(route, null, callback);
};
