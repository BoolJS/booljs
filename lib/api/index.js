'use strict';

/**
 * @alias module:booljs
 * @description Gets a bootstraper instance of a bool.js application
 * @param  {String} namespace - The namespace for the application
 * @param  {String[]} [dependencies] - A list of packages to be loaded with
 * application
 * @return {Object} The instance of a bool.js loaded application
 */
module.exports = function(namespace, dependencies){

    var API         = require('booljs-api')
    ,   Folder      = require('./folder')
    ,   Config      = require('./configurations')
    ,   Loaders     = require('./loaders');

    var _instance   = API.App.getInstance(
        namespace, _.union([ 'booljs-express', 'booljs-nomodel' ], dependencies)
    )
    ,   _folders    = new Folder.List()
    ,   _dbloader   = 'booljs-nomodel'
    ,   _srvloader  = 'booljs-express'
    ,   _booted     = false
    ,   _server     = null;

    return {
        /**
         * @function module:booljs#setBase
         * @description Sets a base folder for project, can be absolute or
         * relative
         * @param {String} folder - the project's location.
         * @return {Object} The loaded application instance
         */
        setBase: function(folder){
            _folders.base = folder;
            return this;
        },
        /**
         * @function booljs#setFolder
         * @description Modifies standard folder names for components or even
         * add new ones to the projects structure
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
         * @function module:booljs#setDatabaseLoader
         * @description Sets the name of a database loader for the project.
         * Default loader is mongoose driver for bool.js
         * @param {String} databaseLoader - The name of the module or route
         * where the loader is being required from node.js
         * @return {Object} The loaded application instance
         */
        setDatabaseLoader: function (databaseLoader) {
            _dbloader = databaseLoader;
            return this;
        },
        /**
         * @function module:booljs#setServerLoader
         * @description Sets the name of a server loader for the project.
         * Default loader is express driver for bool.js
         * @param {String} serverLoader - The name of the module or route
         * where the loader is being required from node.js
         * @return {Object} The loaded application instance
         */
        setServerLoader: function (serverLoader) {
            _srvloader = serverLoader;
            return this;
        },
        /**
         * @function module:booljs#insertBoolError
         * @description Adds BoolError to app components, so it can be used in
         * application,
         * @param {module:booljs-doneCallback} [done] - Executes once process
         * is complete.
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
         * @function module:booljs#readConfigurations
         * @description Reads configurations. Gives hints about progress to
         * notify user what is happening.
         * @param {module:booljs-doneCallback} done - Executes when reading
         * process is complete.
         * @param {module:booljs-progressCallback} progress - Executes once a
         * single configuration file has been read.
         * @return {Promise}
         */
        readConfigurations: function(done, progress){
            return new Config(
                _instance, _folders.configuration, done, progress
            );
        },
        /**
         * @function module:booljs#readFiles
         * @description Returns a list of the components' code files, so it's
         * possible to use them later to load code components
         * @param {module:booljs-doneCallback} done - Executes when reading
         * process is complete.
         * @param {module:booljs-progressCallback} progress - Executes once a
         * single file has been read.
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
         * @function module:booljs#loadDatabase
         * @description Opens a Database connection and fetches models using a
         * database loader.
         * @return {Promise}
         */
        loadDatabase: function () {
            return Loaders.database(_instance, _dbloader);
        },
        /**
         * @function module:booljs#loadComponents
         * @description Loads up components' code, wrapping them into objects
         * @return {Promise}
         */
        loadComponents: function () {
            return Loaders.components(_folders, _instance);
        },
        /**
         * @function module:booljs#bootServer
         * @description Configures and boots up server
         * @return {Promise}
         */
        bootServer: function () {
            return Loaders.server(_instance, _srvloader);
        },
        /**
         * @function module:booljs#run
         * @description Boots up bool.js
         * @param {module:booljs-doneCallback} done - Executes when booting
         * process is complete.
         * @param {Callback} progress - Executes once a single steps have been
         * executed
         * @return {Promise}
         */
        run: function (done, progress) {
            var context = this;
            done = done || function () {};

            if(_booted){
                return q.resolve({
                    app: _instance.getComponents(),
                    server: _server
                });
            }

            return context.
                insertBoolError().
            readConfigurations(undefined, progress).then(function () {
                return context.readFiles(undefined, progress);
            }).then(function () {
                return context.loadComponents();
            }).then(function () {
                return context.loadDatabase();
            }).then(function () {
                return context.bootServer(done, progress);
            }).then(function (server) {
                _server = server;
                _booted = true;

                done(undefined, {
                    app: _instance.getComponents(),
                    server: _server
                });
                return q.resolve({
                    app: _instance.getComponents(),
                    server: _server
                });
            });
        }
    };

    /**
     * @callback module:booljs~progressCallback
     * @param {Object} [data] - Indicates which data has been progressing.
     */

    /**
     * @callback module:booljs~doneCallback
     * @param {Error} err - Shows error in case it happened
     * @param {Object} data - Retrieves final data
     */

};
