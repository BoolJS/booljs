'use strict';

/**
 * @private
 * Boots server using instance data and a server plug-in
 * @param  {Object} _instance - Application's instance
 * @param  {Object} _loader - Server loader plugin
 * @return {Promise}
 */
module.exports = function (_instance, _loader) {
    var loader;
    if(typeof _loader == 'string') {
        loader = require(_loader);
    } else {
        loader = _loader;
    }

    return loader.init(_instance).then(function (server) {
        return loader.middleware(_instance, server);
    }).then(function (server) {
        return loader.router(_instance, server);
    }).then(function (server) {
        return loader.boot(server);
    });
};
