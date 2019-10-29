'use strict';

const isFunction =
    object => !!(object && object.constructor && object.call && object.apply);

const { Plugins, Error } = require('@booljs/api');

exports.openDatabases = function (instance, drivers) {
    return Promise.all(drivers.map(async driver => {
        const loader = Plugins.get(driver);

        if (loader === undefined) {
            throw new Error(0, 'E_LOADER_NOT_FOUND', 'Loader not found');
        }

        const settings = instance.getComponents().configuration
            .get(drivers.length > 1
                ? loader.connectionSettingsStoreName
                : 'database');
        const connection = await loader.openDatabase(settings);

        return { loader, connection };
    }));
};

/**
 * @private
 * @description Recursively fetches models
 * @param {Object} models - The models Object
 * @param {Object} loader - The loader used to try loading the model
 * @param {Object} connection - The connection (if any) used by the driver
 * @return {Promise}
 */
exports.listModels = async function (models) {
    const list = [];

    for (const key in models) {
        if (!isFunction(models[key])) {
            list.concat(await exports.fetchModels(models[key]));
        } else {
            list.push({ models, key });
        }
    }

    return list;
};

exports.fetchModel = async function (instance, loaders, { models, key }) {
    const BaseModel = models[key];
    let Model;

    for (const { loader, connection } of loaders) {
        if (BaseModel.prototype instanceof loader.modelClass()) {
            Model = await loader
                .fetchModels(instance, key, BaseModel, connection);
        }
    }

    if (Model === undefined) {
        Model = class BoolJSNativeModel extends BaseModel {
            constructor (...params) {
                super(instance.getComponents(), ...params);
            }
        };
    }
};

/**
 * @private
 * @description Loads database from a DatabaseLoader plugin
 * @param {Object} instance - The application instance
 * @param {Object} drivers - An existing list of database drivers
 * @return {Promise}
 */
module.exports = async function DatabaseLoader (instance, drivers) {
    const modelsList = await exports
        .listModels(instance.getComponents().models);

    const loaders = await exports.openDatabases(instance, drivers);

    for (const { models, key } of modelsList) {
        const Model = exports
            .fetchModel(instance, loaders, { models, key });
        instance.insertComponent(key, Model, models);
    }

    for (let { loader } of loaders) {
        if (isFunction(loader.afterFetch)) {
            await loader.afterFetch();
        }
    }
};
