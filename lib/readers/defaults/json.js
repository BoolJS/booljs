'use strict';

/**
 * @private
 * @description JSON reader for bool.js
 * @param {String} route - The file's route
 * @param {module:booljs~doneCallback} callback - Executes a call to return the
 * data asynchronously
 */
module.exports = function(route, callback){
    var json = require('jsonfile');
    json.readFile(route, callback);
};
