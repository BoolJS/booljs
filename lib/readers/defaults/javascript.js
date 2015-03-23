'use strict';

exports = function(route, callback){
    callback(require(route));
};
