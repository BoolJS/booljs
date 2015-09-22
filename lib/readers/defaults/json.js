'use strict';

/** @ignore */
module.exports = function(route, callback){
    var json = require('jsonfile');
    json.readFile(route, callback);
};
