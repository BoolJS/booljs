'use strict';

const CSON = require('cson');

/**
 * @private
 * @description CSON reader for bool.js
 * @param {String} route - The file's route
 * @returns {Promise}
 */
module.exports = function (route) {
    return new Promise((resolve, reject) => {
        CSON.parseCSONFile(route, null, (error, data) => {
            if (error !== undefined && error !== null) {
                return reject(error);
            }
            return resolve(data);
        });
    });
};
