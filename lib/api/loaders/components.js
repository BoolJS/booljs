'use strict';

const _ = require('underscore');

exports.wrapComponent = function (instance, Component) {
    return class BoolJSComponent {
        constructor (...params) {
            return new (Function.prototype.bind.apply(Component, [
                null, instance.getComponents()
            ].concat(params)))();
        }
    };
};

/**
 * @private
 * @description Loads components from folder list and insert them into
 * application's instance
 * @param  {Object} _folders - Object managing folders
 * @param  {Object} _instance - Application instance
 * @return {Promise}
 */
exports.fetch = function (instance, component) {
    for (let key in component) {
        if (typeof component[key] === 'function') {
            instance.insertComponent(
                key, exports.wrapComponent(instance, component[key]), component
            );
        } else if (typeof component[key] === 'object') {
            exports.fetch(instance, component[key]);
        }
    }
};

module.exports = async function (folders, instance) {
    let components = _.omit(folders.paths, [ 'configuration', 'models' ]);

    for (let type in components) {
        exports.fetch(instance, instance.getComponents()[type]);
    }
};
