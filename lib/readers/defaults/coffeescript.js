'use strict';

module.exports = function(route, callback){
    try {
        require('coffee-script/register');
        callback(null, require(route));
    } catch(err){
        callback(err);
    }
};
