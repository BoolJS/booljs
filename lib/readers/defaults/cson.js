'use strict';

module.exports = function(route, callback){
    var cson = require('cson');
    cson.parseCSONFile(route, null, callback);
};
