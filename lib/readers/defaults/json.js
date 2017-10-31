'use strict';

/**
 * @private
 * @description JSON reader for bool.js
 * @param {String} route - The file's route
 * @returns {Promise}
 */
module.exports = async function (route) {
    return require(route);
};
