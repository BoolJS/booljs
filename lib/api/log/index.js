'use strict';

const chalk = require('chalk');

/**
 * @private
 * @description Log object
 * @type {Object}
 */
module.exports = class Logger {
    static isDevelopment = process.env.NODE_ENV === 'development';

    static logger (type) {
        const text = `${type.toUpperCase()}: [${Date.toString()}]`;
        switch (type) {
        case 'error': return chalk.red.bold(text);
        case 'warn': return chalk.yellow.bold(text);
        case 'log':
        default: return chalk.white.bold(text);
        }
    }

    /**
     * Emits the logging of a process to the console
     * @param  {String} type The definition of the process type
     * @param  {String} name The name of the component
     */
    static log (type, name) {
        if (this.isDevelopment) {
            console.log(chalk`${this.logger('log')} Loading %s %s`, name, type);
        }
    }

    /**
     * Emits an error in a process to the console
     * @param  {String} type The definition of the process type
     * @param  {String} name The name of the component
     */
    static error (type, name, err) {
        if (this.isDevelopment) {
            console.error(chalk`${this.logger('error')} Failed to load %s %s. Reason: %s`,
                name, type, err);
        }
    }

    /**
     * Emits a warning error in a process to the console
     * @param  {String} type The definition of the process type
     * @param  {String} name The name of the component
     */
    static warn (type, name, err) {
        if (this.isDevelopment) {
            console.warn(chalk`${this.logger('warn')} Failed to load %s %s. Reason: %s'`,
                name, type, err || '');
        }
    }
};
