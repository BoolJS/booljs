'use strict';

require('coffeescript/register');

/**
 * @private
 * @description CoffeeScript reader for bool.js
 * @param {String} route - The file's route
 * @returns {Promise}
 */
module.exports = async function (route) {
    const imported = require(route);

    if (imported !== undefined) {
        return imported;
    }

    throw new Error(0, 'EMODNOTFOUND', 'The required module wasn\'t found');
};
