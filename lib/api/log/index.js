'use strict';

var isDevelopment = process.env.NODE_ENV === 'development';

/**
 * @private
 * @description Log object
 * @type {Object}
 */
module.exports = {
    /**
     * Emits the logging of a process to the console
     * @param  {String} type The definition of the process type
     * @param  {String} name The name of the component
     */
    log: function(type, name){
        if(isDevelopment) log.info('Loading %s %s', name, type);
    },
    /**
     * Emits an error in a process to the console
     * @param  {String} type The definition of the process type
     * @param  {String} name The name of the component
     */
    error: function(type, name, err){
        if(isDevelopment) log.error(
            'Failed to load %s %s. Reason: %s', name, type, err
        );
    },
    /**
     * Emits a warning error in a process to the console
     * @param  {String} type The definition of the process type
     * @param  {String} name The name of the component
     */
    warn: function(type, name, err){
        if(isDevelopment) log.warn(
            'Failed to load %s %s. Reason: %s', name, type, err || ''
        );
    }
};
