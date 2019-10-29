'use strict';

const { readdir } = require('fs').promises;
const { join, parse }  = require('path');
const { Error } = require('@booljs/api');
const Reader = require('../../readers');

exports.readFiles = async function (instance, route, files) {
    const fileRegex = /([A-Za-z-_ ]+)\.([A-Za-z]+)/;

    for (const file of files) {
        const filename = join(route, file);
        const info = parse(filename);

        if (!fileRegex.test(file)) {
            throw new Error(0, 'E_INVALIDFILENAME',
                'The file name format is invalid');
        } else {
            instance.getComponents().configuration
                .set(info.name, await new Reader().readStatic(info.ext, filename));
        }
    }

    instance.getComponents().configuration.freeze();
};

/**
 * Read configuration files
 * @param {Object} instance - Application's instance
 * @param {String} route - Configuration's directory
 * @param {module:booljs~doneCallback} done - Executed once reading process is
 * completed
 * @param {module:booljs~progressCallback} progress - Executed after each file
 * has been read
 * @return {Promise}
 */
module.exports = async function (instance, route) {
    const files = await readdir(route);
    return exports.readFiles(instance, route, files);
};
