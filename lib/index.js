'use strict';

module.exports = (function(){

    var booljs = require('booljs-api');
    var _instance = null;
    var _configFolder = "config";

    return {
        init: function(ns){
            instance = API.App.getInstance(ns);
            return this;
        },
        configFolder: function(folder){
            _configFolder = folder;
            return this;
        }
    };

})();
