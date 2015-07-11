'use strict';

/**
 * @alias module:booljs
 * @description Gets a bootstraper instance of a bool.js application
 * @param  {String} namespace   The namespace for the application
 * @return {Object}             The instance of a bool.js loaded application
 */
module.exports = function(namespace){

    var API         = require('booljs-api')
    ,   Folder      = require('./folder')
    ,   Config      = require('./configurations');

    var _instance   = API.App.getInstance(namespace)
    ,   _folders    = new Folder.List();

    return {
        /**
         * @function
         * Sets a base folder for project, can be absolute or relative
         * @param {String} folder - the project's location.
         * @return {Object} The loaded application instance
         */
        setBase: function(folder){
            _folders.base = folder;
            return this;
        },
        /**
         * @function
         * Modifies standard folder names for components or even add new ones to the projects 
         * structure
         * @param {String} key - The identifier of the resource or resources group to be relocated
         * @param {String} folder - An absolute or relative location to point the resource
         * @return {Object} The loaded application instance
         */
        setFolder: function(key, folder){
            _folders[key] = folder;
            return this;
        },
        /**
         * @function
         * Reads configurations. Gives hints about progress to notify user what is happening.
         * @param {Callback} done - Executes when reading process is complete.
         * @param {Callback} progress - Executes once a single configuration file has been read.
         * @return {Promise}
         */
        readConfigurations: function(done, progress){
            return new Config(
                _instance, _folders.configuration, done, progress
            );
        },
        /**
         * @function
         * Returns a list of the components' code files, so it's possible to use them later to 
         * load code components
         * @param {Callback} done - Executes when reading process is complete.
         * @param {Callback} progress - Executes once a single configuration file has been read.
         * @return {Promise}
         */
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
