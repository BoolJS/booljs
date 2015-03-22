'use strict';

module.exports = function(route, callback){
    require('coffee-script/register');
    callback(require(route));
};
