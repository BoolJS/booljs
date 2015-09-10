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
    ,   Config      = require('./configurations')
    ,   Loaders     = require('./loaders');

    var _instance   = API.App.getInstance(namespace)
    ,   _folders    = new Folder.List()
    ,   _dbloader   = 'booljs-nomodel';

    return {
        setBase: function(folder){
            _folders.base = folder;
            return this;
        },
        /**
         * @function
         * Modifies standard folder names for components or even add new ones
         * to the projects structure
         * @param {String} key - The identifier of the resource or resources
         * group to be relocated
         * @param {String} folder - An absolute or relative location to point
         * the resource
         * @return {Object} The loaded application instance
         */
        setFolder: function(key, folder){
            _folders[key] = folder;
            return this;
        },
        /**
         * @function
         * Adds BoolError to app components, so it can be used in application,
         * @param {Callback} done - Executes once process is complete.
         */
         /**
          * @function
          * Sets the name of a database loader for the project. Default loader
          * is mongoose driver for bool.js
          * @param {String} databaseLoader - The name of the module or route
          * where the loader is being required from node.js
          */
         setDatabaseLoader: function (databaseLoader) {
             _dbloader = databaseLoader;
             return this;
         },
         /**
          * @function
          * Sets a base folder for project, can be absolute or relative
          * @param {String} folder - the project's location.
          * @return {Object} The loaded application instance
          */
        insertBoolError: function (done) {
            done = done || function() {};

            try {
                _instance.insertComponent('Error', API.Error);
                done();
                return this;
            } catch(err){
                done(err);
                return this;
            }
        },
        /**
         * @function
         * Reads configurations. Gives hints about progress to notify user
         * what is happening.
         * @param {Callback} done - Executes when reading process is complete.
         * @param {Callback} progress - Executes once a single configuration
         * file has been read.
         * @return {Promise}
         */
        readConfigurations: function(done, progress){
            return new Config(
                _instance, _folders.configuration, done, progress
            );
        },
        /**
         * @function
         * Returns a list of the components' code files, so it's possible to
         * use them later to load code components
         * @param {Callback} done - Executes when reading process is complete.
         * @param {Callback} progress - Executes once a single configuration
         * file has been read.
         * @return {Promise}
         */
        readFiles: function(done, progress){
            var componentReaders = [];
            done = done || function () {};

            for(var route in _.omit(_folders.paths, 'configuration')){
                _instance.insertComponent(route, {});
                componentReaders.push(Folder.read(
                    _instance, _instance.getComponents()[route],
                    _folders[route], route,
                    null,
                    progress
                ));
            }

            // Reading components
            return q.all(componentReaders).then(function () {
                done();
            }).catch(done);
        },
        /**
         * @function
         * Opens a Database connection and fetches models using a database
         * loader.
         * @param {Callback} done - Executes when reading process is complete.
         * @param {Callback} progress - Executes once a single configuration
         * file has been read.
         * @return {Promise}
         */
        loadDatabase: function (done, progress) {
            done = done || function () {};
            return Loaders.database(_instance, _dbloader, done, progress);
        },
        /**
         * @function
         * Loads up components' code, wrapping them into objects
         * @param {Callback} done - Executes when reading process is complete.
         * @param {Callback} progress - Executes once a single configuration
         * file has been read.
         * @return {Promise}
         */
        loadComponents: function (done, progress) {
            done = done || function () {};

            return Loaders.components(_instance, done, progress);
        },
        /**
         * Boots up bool.js
         * @param {Callback} done - Executes when reading process is complete.
         * @param {Callback} progress - Executes once a single configuration
         * file has been read.
         * @return {Promise}
         */
        run: function (done, progress) {
            var context = this;
            done = done || function () {};

            return context.
                insertBoolError().
            readConfigurations().then(function () {
                return context.readFiles();
            }).then(function () {
                return context.loadDatabase();
            }).then(function () {
                return context.loadComponents(done, progress);
            });
        }
    };

};
