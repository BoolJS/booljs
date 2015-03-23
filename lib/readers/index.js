'use strict';

module.exports = (function(){

    var _static = {
        'json': require('./defaults/json'),
        'cson': require('./defaults/cson')
    }
    ,   _code   = {
        'js': require('./defaults/javascript'),
        'coffee': require('./defaults/coffeescript')
    };

    this.insertStaticReeader = function(name, reader){
        if(!_static[name]) _static[name] = reader;
    };

    this.insertCodeReeader = function(name, reader){
        if(!_code[name]) _code[name] = reader;
    };

    this.readStatic = function(name, route, callback){
        _static[name](route, callback);
    };

    this.readCode = function(name, route, callback){
        _code[name](route, callback);
    };

})();
