'use strict';

/** @ignore */
exports = function(route, callback){
    var API = require('booljs-api');

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
