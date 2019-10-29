'use strict';

const path = require('path');

const Path = Symbol('BoolJS.Folder.List##path');
const BasePath = Symbol('BoolJS.Folder.List##base');
const Subfolders = Symbol('BoolJS.Folder.List##subfolders');

/**
 * @private
 * @description Folder's list by instance
 * @return {Object} A folders' list manager
 */
module.exports = class FolderList {
    static [Path] = process.cwd();

    [BasePath] = FolderList[Path];
    [Subfolders] = {
        configuration: 'configuration',
        controllers: 'controllers',
        dao: 'dao',
        models: 'models',
        plugins: 'plugins',
        routes: 'routes'
    };

    constructor () {
        for (var route in this[Subfolders]) {
            this.loadSubfolderProperties(route, this[Subfolders][route]);
        }
    }

    /** @ignore */
    get paths () {
        return this.subfolders;
    }

    /** @ignore */
    get base () {
        return this.base;
    }

    /** @ignore */
    set base (folder) {
        if (path.isAbsolute(folder)) {
            this[BasePath] = folder;
        } else {
            this[BasePath] = path.join(FolderList[Path], folder);
        }
    }

    loadSubfolderProperties (key, location) {
        Object.defineProperty(this, key, {
            /** @ignore */
            get () {
                return (path.isAbsolute(location)
                    ? location
                    : path.join(this[BasePath], location)
                );
            },
            /** @ignore */
            set (folder) {
                this[Subfolders][key] = folder;
            }
        });
    }
};
