'use strict';

/**
 * @private
 * Loads database from a DatabaseLoader plugin
 * @param {Object} _instance - The application instance
 * @param {Object} _loader - An existing database loader
 * @return {Promise}
 */
module.exports = function DatabaseLoader(_instance, _loader) {
    var API     = require('booljs-api')
    ,   loader  = API.Plugins.getInstance().get(_loader);

    return loader.openDatabase(
        _instance.getComponents().configuration.get('database')
    ).then(function (connection) {
        return loader.fetchModels(
            _instance,
            _instance.getComponents().models,
            connection
        );
    });
};
