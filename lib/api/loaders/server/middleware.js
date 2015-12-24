'use strict';

module.exports = function (_instance, loader, router) {
    var API     = require('booljs-api')
    ,   async   = require('async')
    ,   each    = q.nbind(async.eachSeries, async);

    var middlewarePlugins = API.Plugins.getInstance().list(API.Middleware);

    return each(middlewarePlugins, function (plugin, next) {
        try {
            plugin.checkIntegrity();
        } catch(err){
            next(err);
        } finally {
            var middleware = plugin.action(_instance, router);
            loader.middleware(_instance, router, middleware).then(function (r) {
                router = r;
            });
            next();
        }
    }).then(function () {
        return q.resolve(router);
    });

};
