'use strict';

const { Plugins, Error } = require('booljs.api');

/**
 * @private
 * @description Loads database from a DatabaseLoader plugin
 * @param {Object} _instance - The application instance
 * @param {Object} _loader - An existing database loader
 * @return {Promise}
 */
module.exports = async function DatabaseLoader (instance, drivers) {
    for (let driver of drivers) {
        let loader = Plugins.get(driver);

        if (loader === undefined) {
            throw new Error(0, 'E_LOADER_NOT_FOUND', 'Loader not found');
        }

        let connection = await loader.openDatabase(instance
            .getComponents().configuration.get('database')
        );

        let { models } = instance.getComponents();
        for (let model in models) {
            if (models[model].prototype instanceof loader.modelClass()) {
                instance.insertComponent(model, await loader.fetchModels(
                    connection, models[model], instance
                ), models);
            }
        }
    }
};
