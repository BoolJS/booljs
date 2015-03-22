'use strict';

module.exports = function(ns){

    var API         = require('booljs-api')
    ,   Folder      = require('./folder');

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
        readFiles: function(done, progress){

            // Reading controllers
            _instance.insertComponent("controllers", {});
            Folder.read(
                _instance,
                _instance.getComponents().controllers,
                _folders.controllers,
                "controller",
                done,
                progress
            );
            return this;
        }
    };

};
