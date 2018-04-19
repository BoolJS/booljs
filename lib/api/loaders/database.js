'use strict';

const isFunction = obj => !!(obj && obj.constructor && obj.call && obj.apply);

const { Plugins, Error } = require('booljs.api');

/**
 * @private
 * @description Recursively fetches models
 * @param {Object} instance - The application instance
 * @param {Object} models - The models Object
 * @param {Object} loader - The loader used to try loading the model
 * @param {Object} connection - The connection (if any) used by the driver
 * @return {Promise}
 */
exports.fetchModels = async function (instance, models, loader, connection) {
    for (let model in models) {
        if (!isFunction(models[model])) {
            await exports.fetchModels(instance, models[model], loader, connection);
        } else if (models[model].prototype instanceof loader.modelClass()) {
            instance.insertComponent(model, await loader.fetchModels(
                instance, model, models[model], connection
            ), models);
        }
    }
}

/**
 * @private
 * @description Loads database from a DatabaseLoader plugin
 * @param {Object} instance - The application instance
 * @param {Object} drivers - An existing list of database drivers
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
        await exports.fetchModels(instance, models, loader, connection);
    }
};
