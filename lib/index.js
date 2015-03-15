'use strict';

module.exports = (function(){

    var API = require('booljs-api');
    var _instance = null;

    var _configFolder = null;

    return {
        init: function(ns){
            _instance = API.App.getInstance(ns);
            return this;
        },
        configFolder: function(folder){
            _configFolder = folder;
            return this;
        },
        readFiles: function(callback){
            var folderReader    = require('./api/readFolder')
            ,   jsonReader      = require('./readers/json');

            // Reading configuration files
            folderReader(
                _configFolder || 'config', jsonReader, function(err, name){
                    if(err) log.error(err);
                    else {
                        if (process.env.NODE_ENV === "development"){
                            log.info("%s settings were loaded", name);
                        }
                        if(callback) callback(err, name);
                    }
                }
            );

            return this;
        }
    };

})();
