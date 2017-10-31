'use strict';

/**
 * @private
 * @class ReaderList
 * @description Determines which readers are available to use in booljs
 * bootstraping process
 */
module.exports = function () {
    const staticReaders = {
        '.json': require('./defaults/json'),
        '.cson': require('./defaults/cson')
    };

    const codeReaders = {
        '.js': require('./defaults/javascript'),
        '.coffee': require('./defaults/coffeescript')
    };

    /**
     * Insert a static (non-code) files reader.
     * @param  {String} name - The extension of the file.
     * @param  {Function} reader - The function of the reader.
     */
    this.insertStaticReader = function (name, reader) {
        if (!staticReaders[name]) {
            staticReaders[name] = reader;
        }
    };

    /**
     * Insert a code files reader.
     * @param  {String} name - The extension of the code file.
     * @param  {Function} reader - The function of the reader.
     */
    this.insertCodeReader = function (name, reader) {
        if (!codeReaders[name]) {
            codeReaders[name] = reader;
        }
    };

    /**
     * Reads a static (non-code) file
     * @param  {String} name - The name of the reader, file extension tipically.
     * @param  {String} route - The route of the file
     * @param  {Function} callback - A return function for retrieving the data.
     */
    this.readStatic = function (name, route) {
        return staticReaders[name](route);
    };

    /**
     * Reads a code file
     * @param  {String} name - The name of the reader, file extension tipically.
     * @param  {String} route - The route of the file.
     * @param  {Function} callback - A return function for retrieving the code.
     */
    this.readCode = function (name, route) {
        return codeReaders[name](route);
    };
};
