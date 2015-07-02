'use strict';

/**
 * @alias module:booljs
 * @description Gets a bootstraper instance of a bool.js application
 * @param  {String} namespace   The namespace for the application
 * @return {Object}             The instance of a bool.js loaded application
 */
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
            return new Config(
                _instance, _folders.configuration, done, progress
            );
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
