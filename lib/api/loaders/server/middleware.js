'use strict';

module.exports = function (_instance, loader, server) {
    var API     = require('booljs-api')
    ,   async   = require('async')
    ,   each    = q.nbind(async.eachSeries, async);

    var middlewarePlugins = API.Plugins.getInstance().get(API.Middleware);

    return each(middlewarePlugins, function (plugin, next) {
        try {
            plugin.checkIntegrity();
        } catch(err){
            next(err);
        } finally {
            loader.middleware(_instance, server, plugin).then(function (s) {
                server = s;
            });
            next();
        }
    }).then(function () {
        return q.resolve(server);
    });

};
