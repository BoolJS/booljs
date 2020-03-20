'use strict';

const { Error } = require('@booljs/api');

/**
 * @private
 * @description Javascript reader for bool.js
 * @param {String} route - The file's route
 * @returns {Promise}
 */

module.exports = async function (route) {
    try {
        const imported = require(route);

        if (imported !== undefined) {
            return imported;
        }

        throw new Error(0, 'EMODNOTFOUND', 'The required module wasn\'t found');
    } catch (error) {
        if (error.code === 'ERR_REQUIRE_ESM') {
            return importEsmModule(route);
        }

        throw error;
    }
};

/**
 * @private
 * @description ESM reader for bool.js
 * @param {String route} - The file's route
 * @returns {Promise<Object>}
 */
async function importEsmModule (route) {
    const imported = await import(route);

    if (imported.default) {
        return imported.default;
    }

    return imported;
}
