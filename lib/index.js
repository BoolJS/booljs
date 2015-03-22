'use strict';

var API         = require('./api')
,   instances   = {             };

module.exports = function(ns){

    if(!instances[ns]){
        instances[ns] = new API(ns);
    }

    return instances[ns];

};
