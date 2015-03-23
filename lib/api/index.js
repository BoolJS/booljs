'use strict';

module.exports = function(ns){

    var API         = require('booljs-api')
    ,   Folder      = require('./folder')
    ,   Config      = require('./configurations');

    var _instance   = API.App.getInstance(ns)
    ,   _folders    = new Folder.List();

    return {
        setBase: function(folder){
            _folders.base = folder;
            return this;
        },
        setFolder: function(key, folder){
            _folders[key] = folder;
            return this;
        },
        readConfigurations: function(done, progress){
            return Config(_instance, _folders.configuration, done, progress);
        },
        readFiles: function(done, progress){

            // Reading controllers
            _instance.insertComponent("controllers", {});
            _instance.insertComponent("dao", {});
            return q.all([
                Folder.read(
                    _instance,
                    _instance.getComponents().controllers,
                    _folders.controllers,
                    "controller",
                    null,
                    progress
                ),
                Folder.read(
                    _instance,
                    _instance.getComponents().dao,
                    _folders.dao,
                    "dao",
                    done,
                    progress
                )
            ]);
        }
    };

};
