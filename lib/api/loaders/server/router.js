'use strict';

module.exports = function (_instance, loader, router) {

    var API;
    try {
        API = require('bool.js/api');
    } catch (err){
        API = require('booljs-api');
    }

    var async           = require('async')
    ,   each            = q.nbind(async.forEachOfSeries, async)
    ,   store           = API.Plugins.getInstance();

    // Get route middleware and add it by policy types
    var routeModules    = _instance.getComponents().routes
    ,   routeMiddleware = store.list(API.RouteMiddleware)
    ,   middlewareOpts  = {
        mandatory: [],
        omittable: []
    };

    return each(routeMiddleware, function (middleware, key, next) {
        try {
            middleware.checkIntegrity();
        } catch (e) {
            next(e);
        } finally {
            if(middleware.type === 'mandatory'){
                middlewareOpts.mandatory.push(middleware);
            } else {
                middlewareOpts.omittable.push(middleware);
            }
            next();
        }
    }).then(function () {
        return each(routeModules, function (Module, name, next) {
            var module = new Module();

            return each(module, function (route, key, _next) {
                var applicableMiddleware = [];

                return q.all([
                    each(middlewareOpts.mandatory, (_middleware, k, _next) => {
                        for(var policy in _middleware.policies){
                            if(route[policy] === _middleware.policies[policy]){
                                applicableMiddleware.push(_middleware);
                                return _next();
                            }
                        }
                        _next();
                    }),
                    each(middlewareOpts.omittable, (_middleware, k, _next) => {
                        for(var policy in _middleware.policies){
                            if(route[policy] !== _middleware.policies[policy]){
                                applicableMiddleware.push(_middleware);
                                return _next();
                            }
                        }
                        _next();
                    })
                ]).then(function () {
                    var routeMiddleware = (_
                        .chain(applicableMiddleware)
                        .sort('name')
                        .sort('priority')
                        .map((mid) => mid.action(_instance, router, route))
                    ).value();

                    loader.route(
                        _instance, router, routeMiddleware, route
                    ).then((_router) => {
                        router = _router;
                        _next();
                    });
                });
            }).then(function () {
                next();
            });
        });

    }).then(function () {
        return q.resolve(router);
    });


};
