'use strict';

const { Error } = require('booljs.api');
const { lstat, readdir } = require('fs');
const { join, parse }  = require('path');
const Reader = require('../../readers');

exports.readFiles = async function (instance, component, route, files) {
    const fileRegex = /([A-Za-z0-9-_ ]+)\.([A-Za-z0-9_]+)/;

    for (let file of files) {
        let filename = join(route, file);

        let info = parse(filename);

        let cannonicalName = info.name.toLowerCase();
        let separatedNames = cannonicalName.split(/-|_/);

        info.name = separatedNames.map(name => {
            return name.charAt(0).toUpperCase() + name.slice(1);
        }).join('');

        if ((await exports.getStats(filename)).isDirectory()) {
            info.name = info.name.charAt(0).toLowerCase() + info.name.slice(1);
            instance.insertComponent(info.name, {}, component);
            await module.exports(instance, component[info.name], filename);
        } else {
            if (!fileRegex.test(file)) {
                throw new Error(0,
                    'E_INVALIDFILENAME',  'The file name format is invalid'
                );
            } else {
                let reader = new Reader();

                instance.insertComponent(
                    info.name,
                    await reader.readCode(info.ext, filename),
                    component
                );
            }
        }
    }
};

exports.getStats = async function (route) {
    return new Promise((resolve, reject) => {
        lstat(route, function (error, stats) {
            if (error !== undefined && error !== null) {
                return reject(error);
            }
            return resolve(stats);
        });
    });
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
 * Read generic folders, setting names to namespaces order
 * @param {Object} instance - Application's instance
 * @param {Object} component - The component type to be inserted into
 * @param {String} route - Components's directory
 * @return {Promise}
 */
module.exports = async function (instance, component, route) {
    try {
        let files = await exports.readDirectory(route);
        return exports.readFiles(instance, component, route, files);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
};
