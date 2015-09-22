'use strict';

/** @ignore */
module.exports = function(route, callback){
    var cson = require('cson');
    cson.parseCSONFile(route, null, callback);
};
