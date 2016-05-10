'use strict';

module.exports = function (_instance, loader, router) {
    var API     = require('booljs-api')
    ,   async   = require('async')
    ,   each    = q.nbind(async.eachSeries, async);

    var middlewarePlugins = API.Plugins.list(API.Middleware);

    return each(middlewarePlugins, function (plugin, next) {
        var middleware = plugin.action(_instance, router);
        loader.middleware(_instance, router, middleware).then(_router => {
            router = _router;
        });
        next();
    }).then(function () {
        return q.resolve(router);
    });

};
