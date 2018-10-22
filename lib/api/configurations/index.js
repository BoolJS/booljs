'use strict';

const { Error } = require('@booljs/api');
const { readdir } = require('fs');
const { join, parse }  = require('path');
const Reader = require('../../readers');

exports.readFiles = async function (instance, route, files) {
    const fileRegex = /([A-Za-z-_ ]+)\.([A-Za-z]+)/;

    for (let file of files) {
        let filename = join(route, file);
        let info = parse(filename);

        if (!fileRegex.test(file)) {
            throw new Error(0,
                'E_INVALIDFILENAME',  'The file name format is invalid'
            );
        } else {
            var reader = new Reader();
            instance.getComponents().configuration.set(
                info.name, await reader.readStatic(info.ext, filename)
            );
        }
    }

    instance.getComponents().configuration.freeze();
};

exports.readDirectory = function (route) {
    return new Promise((resolve, reject) => {
        readdir(route, function (error, files) {
            if (error !== undefined && error !== null) {
                return reject(error);
            }
            return resolve(files);
        });
    });
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
    let files = await exports.readDirectory(route);
    return exports.readFiles(instance, route, files);
};
