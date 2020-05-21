'use strict';

const _ = require('underscore');
const Readyness = require('readyness');
const { Error, App } = require('@booljs/api');

const Folder = require('./folder');
const loadConfigurations = require('./configurations');
const { loadComponents, loadDatabases, loadServer } = require('./loaders');
const deprecationNote = require('./utilities/deprecation-note');

/**
 * @class BoolJSBootstrapper
 * @description Gets a bootstraper instance of a bool.js application
 * @param  {String} namespace - The namespace for the application
 * @param  {String[]} [dependencies] - A list of packages to be loaded with
 * application
 * @return {BoolJSBootstrapper} The instance of a bool.js loaded application
 */
module.exports = class BoolJSBootstrapper {
    Error = Error;
    folders = new Folder.List();

    databaseDrivers = [];
    serverDrivers = [];
    booted = false;
    booting = false;
    server = null;

    constructor (namespace, dependencies = []) {
        this.instance = App.getInstance(namespace, dependencies);

        if (!this.booted) {
            this.instance.insertComponent('utilities',
                this.instance.getComponents().utilities.getStore());
        }
    }

    /**
     * @function BoolJSBootstrapper#setBase
     * @description Sets a base folder for project, can be absolute or
     * relative
     * @param {String} folder - the project's location.
     * @return {BoolJSBootstrapper} The loaded application instance
     */
    setBase (folder) {
        this.folders.base = folder;
        return this;
    }

    /**
     * @function BoolJSBootstrapper#setFolder
     * @description Modifies standard folder names for components or even
     * add new ones to the projects structure
     * @param {String} key - The identifier of the resource or resources
     * group to be relocated
     * @param {String} folder - An absolute or relative location to point
     * the resource
     * @return {BoolJSBootstrapper} The loaded application instance
     */
    setFolder (key, folder) {
        if (!this.folders.has(key)) {
            this.folders.set(key);
        }

        this.folders[key] = folder;
        return this;
    }

    /**
     * @function BoolJSBootstrapper#setDatabaseLoader
     * @deprecated since v0.9.0
     * @description Sets the name of a database loader for the project.
     * Default loader is nomodel driver for bool.js
     * @param {String} databaseLoader - The name of the module or route
     * where the loader is being required from node.js
     * @return {BoolJSBootstrapper} The loaded application instance
     */
    setDatabaseLoader (databaseLoader) {
        deprecationNote('0.9.0', 'setDatabaseDrivers', true);
    }

    /**
     * @function BoolJSBootstrapper#setDatabaseDrivers
     * @description Sets the name of the database drivers for the project.
     * Default loaders are [ nomodel driver for bool.js ]
     * @param {*} drivers - The name of the module or route
     * where the loader is being required from node.js
     * @return {BoolJSBootstrapper} The loaded application instance
     */
    setDatabaseDrivers (...drivers) {
        this.databaseDrivers = drivers;
        return this;
    }

    /**
     * @function BoolJSBootstrapper#setServerLoader
     * @deprecated since v0.9.0
     * @description Sets the name of a server loader for the project.
     * Default loader is express driver for bool.js
     * @param {String} serverLoader - The name of the module or route
     * where the loader is being required from node.js
     * @return {BoolJSBootstrapper} The loaded application instance
     */
    setServerLoader (serverLoader) {
        deprecationNote('0.9.0', 'setServerDrivers', true);
    }

    /**
     * @function BoolJSBootstrapper#setServerDrivers
     * @description Sets the name of the server loaders for the project.
     * Default loaders are [ express driver for bool.js ]
     * @param {*} drivers - The name of the modules or routers
     * where the loader is being required from node.js
     * @return {BoolJSBootstrapper} The loaded application instance
     */
    setServerDrivers (...drivers) {
        this.serverDrivers = drivers;
        return this;
    }

    /**
     * @function module:booljs#insertBoolError
     * @description Adds BoolError to app components, so it can be used in
     * application,
     * @param {module:booljs-doneCallback} [done] - Executes once process
     * is complete.
     * @return {BoolJSBootstrapper} The loaded application instance
     */
    insertBoolError () {
        this.instance.insertComponent('Error', this.Error);
        return this;
    }

    /**
     * @function module:booljs#readConfigurations
     * @description Reads configurations. Gives hints about progress to
     * notify user what is happening.
     * @return {Promise}
     */
    readConfigurations (done, progress) {
        return loadConfigurations(this.instance, this.folders.configuration);
    }

    /**
     * @function module:booljs#readFiles
     * @description Returns a list of the components' code files, so it's
     * possible to use them later to load code components
     * @return {Promise}
     */
    async readFiles () {
        const componentReaders = [];

        for (var route in _.omit(this.folders.paths, 'configuration')) {
            this.instance.insertComponent(route, {});

            await Folder.read(
                this.instance,
                this.instance.getComponents()[route],
                this.folders[route]
            );
        }

        // Reading components
        return componentReaders;
    }

    /**
     * @function module:booljs#loadDatabase
     * @description Opens a Database connection and fetches models using a
     * database loader.
     * @return {Promise}
     */
    loadDatabase () {
        return loadDatabases(this.instance, this.databaseDrivers);
    }

    /**
     * @function module:booljs#loadComponents
     * @description Loads up components' code, wrapping them into objects
     * @return {Promise}
     */
    loadComponents () {
        return loadComponents(this.folders, this.instance);
    }

    /**
     * @function module:booljs#bootServer
     * @description Configures and boots up server
     * @return {Promise}
     */
    bootServer () {
        return loadServer(this.instance, this.serverDrivers);
    }

    /**
     * @function module:booljs#run
     * @description Bootstraps a new BoolJS instance
     * @param {module:booljs-doneCallback} done - Executes when booting
     * process is complete.
     * @param {Callback} progress - Executes once a single steps have been
     * executed
     * @return {Promise}
     */
    async bootstrap () {
        this.booting = true;
        const booted = Readyness.waitFor('boot');

        this.insertBoolError();

        await this.readConfigurations();
        await this.readFiles();
        await this.loadComponents();
        await this.loadDatabase();

        const server = await this.bootServer();

        this.server = server;
        this.booted = true;
        booted();

        return {
            app: this.instance.getComponents(),
            server: this.server
        };
    }

    /**
     * @function module:booljs#run
     * @description Boots BoolJS up
     * @return {Promise}
     */
    async run () {
        if (this.booted) {
            return {
                app: this.instance.getComponents(),
                server: this.server
            };
        } else if (this.booting) {
            await new Promise((resolve, reject) => {
                Readyness.doWhen(error => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve();
                });
            });

            return this.run();
        }

        return this.bootstrap();
    }
};
