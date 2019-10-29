'use strict';

const _ = require('underscore');

exports.wrapComponent = function (instance, Component) {
    return class BoolJSComponent extends Component {
        constructor (...params) {
            super(instance.getComponents(), ...params);
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
    for (const key in component) {
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
    const components = _.omit(folders.paths, ['configuration', 'models']);

    for (const type in components) {
        exports.fetch(instance, instance.getComponents()[type]);
    }
};
