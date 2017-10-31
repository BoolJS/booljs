/**
 *
 * Bool MVC Framework - Bootstraping Unit
 * Copyright (C) 2015 Bool Inc
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

'use strict';

const API = require('./api');
const instances = {};

/**
 * @module booljs
 * @param  {String}     namespace   Application's namespace
 * @return {Instance}               A bool.js loader instance
 */
module.exports = class BoolJS {
    constructor (namespace, dependencies) {
        if (!instances[namespace]) {
            instances[namespace] = new API(namespace, dependencies);
        }

        return instances[namespace];
    }
};
