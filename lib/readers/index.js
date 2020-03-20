'use strict';

/**
 * @private
 * @class ReaderList
 * @description Determines which readers are available to use in booljs
 * bootstraping process
 */
module.exports = class Readers {
    static staticReaders = {
        '.yaml': require('./defaults/yaml'),
        '.json': require('./defaults/json'),
        '.cson': require('./defaults/cson')
    };

    static codeReaders = {
        '.js': require('./defaults/javascript'),
        '.coffee': require('./defaults/coffeescript')
    };

    static insertReader (field, name, reader) {
        if (!this[field][name]) {
            this[field][name] = reader;
        }
    }

    /**
     * Insert a static (non-code) files reader.
     * @param  {String} name - The extension of the file.
     * @param  {Function} reader - The function of the reader.
     */
    static insertStaticReader (name, reader) {
        this.insertReader('staticReaders', name, reader);
    };

    /**
     * Insert a code files reader.
     * @param  {String} name - The extension of the code file.
     * @param  {Function} reader - The function of the reader.
     */
    static insertCodeReader (name, reader) {
        this.insertReader('codeReaders', name, reader);
    };

    /**
     * Reads a static (non-code) file
     * @param  {String} name - The name of the reader, file extension tipically.
     * @param  {String} route - The route of the file
     * @param  {Function} callback - A return function for retrieving the data.
     */
    static readStatic (name, route) {
        return this.staticReaders[name](route);
    };

    /**
     * Reads a code file
     * @param  {String} name - The name of the reader, file extension tipically.
     * @param  {String} route - The route of the file.
     * @param  {Function} callback - A return function for retrieving the code.
     */
    static readCode (name, route) {
        return this.codeReaders[name](route);
    };
};
