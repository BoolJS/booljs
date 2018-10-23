'use strict';

const isFunction =
    object => !!(object && object.constructor && object.call && object.apply);

const { Plugins, Error } = require('@booljs/api');

/**
 * @private
 * @description Recursively fetches models
 * @param {Object} instance - The application instance
 * @param {Object} models - The models Object
 * @param {Object} loader - The loader used to try loading the model
 * @param {Object} connection - The connection (if any) used by the driver
 * @return {Promise}
 */
exports.fetchModels = async function (instance, models) {
    const list = [];

    for (let key in models) {
        if (!isFunction(models[key])) {
            return list
                .concat(await exports.fetchModels(instance, models[key]));
        } else {
            list.push({ models, key });
        }
    }

    return list;
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
        .fetchModels(instance, instance.getComponents().models);

    const loaders = await Promise.all(drivers
        .map(async (driver, index) => {
            const loader = Plugins.get(driver);

            if (loader === undefined) {
                throw new Error(0, 'E_LOADER_NOT_FOUND', 'Loader not found');
            }

            const settings = instance.getComponents().configuration
                .get(index > 0
                    ? loader.connectionSettingsStoreName
                    : 'database');
            const connection = await loader.openDatabase(settings);

            return { loader, connection };
        }));

    for (let index in modelsList) {
        let { models, key } = modelsList[index];

        const BaseModel = models[key];
        let Model;

        for (let { loader, connection } of loaders) {
            if (BaseModel.prototype instanceof loader.modelClass()) {
                Model = await loader
                    .fetchModels(instance, key, BaseModel, connection);
                modelsList[index] = undefined;
            }
        }

        if (modelsList[index] !== undefined) {
            Model = class BoolJSNativeModel extends BaseModel {
                constructor (...params) {
                    super(instance.getComponents(), ...params);
                }
            };
            modelsList[index] = undefined;
        }

        instance.insertComponent(key, Model, models);
    }
};
