'use strict';

const { join, parse }  = require('path');
const { lstat, readdir } = require('fs').promises;
const { Error } = require('@booljs/api');
const Reader = require('../../readers');

function camelCaseIt (name, type = 'class') {
    const splittedName = name
        .toLowerCase()
        .split(/-|_/);

    switch (type) {
    case 'package': {
        return splittedName
            .map(name => name.charAt(0).toLowerCase() + name.slice(1))
            .join('');
    }
    case 'class': {
        return splittedName
            .map(name => name.charAt(0).toUpperCase() + name.slice(1))
            .join('');
    }
    }
}

exports.readFiles = async function (instance, component, route, files) {
    const fileRegex = /([A-Za-z0-9-_ ]+)\.([A-Za-z0-9_]+)/;

    for (const file of files) {
        const filename = join(route, file);
        const filenameInfo = parse(filename);

        filenameInfo.name = camelCaseIt(filenameInfo.name);

        const fileStats = await lstat(filename);
        if (fileStats.isDirectory()) {
            filenameInfo.name = camelCaseIt(filenameInfo.name, 'package');
            instance.insertComponent(filenameInfo.name, {}, component);
            await module.exports(instance, component[filenameInfo.name], filename);
        } else {
            if (!fileRegex.test(file)) {
                throw new Error(0, 'E_INVALIDFILENAME', 'The file name format is invalid');
            } else {
                instance.insertComponent(filenameInfo.name,
                    await Reader.readCode(filenameInfo.ext, filename), component);
            }
        }
    }
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
        const files = await readdir(route);
        return exports.readFiles(instance, component, route, files);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
};
