'use strict';

/**
 * @private
 * @description Boots server using instance data and a server plug-in
 * @param  {Object} _instance - Application's instance
 * @param  {Object} _loader - Server loader plugin
 * @return {Promise}
 */
module.exports = function (_instance, _loader) {
    var API     = require('booljs-api')
    ,   loader  = API.Plugins.getInstance().get(_loader, API.ServerLoader);

    return loader.init(_instance).then((server) => {
        return require('./preroute')(
            _instance, loader, server
        ).then((router) => {
            return require('./middleware')(
                _instance, loader, router
            ).then((router) => {
                return require('./router')(_instance, loader, router);
            }).then((router) => {
                return require('./postroute')(
                    _instance, loader, router, server
                );
            });
        });
    }).then((server) => {
        return loader.boot(server);
    });
};
