'use strict';

function readers(){

    var _static = {
        'json': require('./json'),
        'cson': require('./cson')
    }
    ,   _code   = {
        'js': require('./javascript'),
        'coffee': require('./coffeescript')
    };

    this.insertStaticReeader = function(name, reader){
        if(!_static[name]) _static[name] = reader;
    };

    this.insertCodeReeader = function(name, reader){
        if(!_code[name]) _code[name] = reader;
    };

};

module.exports = readers();
