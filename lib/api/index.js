'use strict';

module.exports = function(ns){

    var API         = require('booljs-api')
    ,   Folder      = require('./folder');

    var _instance   = API.App.getInstance(ns)
    ,   _folders    = new Folder.List();
    ,   _boot       = Boot(ns);

    return {
        setBase: function(folder){
            _folders.base = folder;
            return this;
        },
        setFolder: function(key, folder){
            _folders[key] = folder;
            return this;
        },
        readFiles: function(callback){

            var jsonReader = require('./readers/json');

            // Reading configuration files
            Folder.read(
                _folders.configuration, jsonReader, function(err, name){
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

};
