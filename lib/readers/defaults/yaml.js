'use strict';

const YAML = require('yaml');

/**
 * @private
 * @description JSON reader for bool.js
 * @param {String} route - The file's route
 * @returns {Promise}
 */
module.exports = async function (route) {
    return YAML.parse(route);
};
