'use strict';

exports = function(route, callback){
    try{
        callback(null, require(route));
    } catch(err){
        callback(err);
    }

};
