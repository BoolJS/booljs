'use strict';

const { Plugins, RouteMiddleware } = require('@booljs/api');
const _ = require('underscore');

module.exports = async function (instance, loader, router) {
    let store = Plugins;

    // Get route middleware and add it by policy types
    let routeModules    = instance.getComponents().routes;
    let routeMiddleware = store.list(RouteMiddleware);

    let mandatoryMiddleware = routeMiddleware
        .filter(middleware => middleware.type === 'mandatory');
    let omittableMiddleware = routeMiddleware
        .filter(middleware => middleware.type === 'omittable');

    for (let key in routeModules) {
        let Module = routeModules[key];
        
            let module = new Module();
            if (!Array.isArray(module)){
            module = [module] ;
            }
        
        
        for (let route of module) {
            let applicableMiddleware = [];

            for (let middleware of mandatoryMiddleware) {
                for (let policy in middleware.policies) {
                    if (route[policy] === middleware.policies[policy]) {
                        applicableMiddleware.push(middleware);
                    }
                }
            }

            for (let middleware of omittableMiddleware) {
                for (let policy in middleware.policies) {
                    if (route[policy] !== middleware.policies[policy]) {
                        applicableMiddleware.push(middleware);
                    }
                }
            }

            let routeMiddleware = (_
                .chain(applicableMiddleware)
                .sortBy('name')
                .sortBy('priority')
                .map(mid => mid.action(instance, router, route))
            ).value();

            router = (await loader
                .route(instance, router, routeMiddleware, route)
            );
        }
    }

    return router;
};
