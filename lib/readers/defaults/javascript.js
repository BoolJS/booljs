'use strict';

const { Error } = require('booljs.api');

/**
 * @private
 * @description Javascript reader for bool.js
 * @param {String} route - The file's route
 * @returns {Promise}
 */

module.exports = async function (route) {
    try {
        let imported = require(route);

        if (imported !== undefined) {
            return imported;
        }

        throw new Error(0, 'EMODNOTFOUND', `The required module wasn't found`);
    } catch (error) {
        throw error;
    }
};
