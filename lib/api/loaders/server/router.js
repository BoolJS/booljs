'use strict';

const arraySortBy = require('../../utilities/array-sortby');
const { Plugins, RouteMiddleware } = require('@booljs/api');


function matchPolicies (middlewareList, condition) {
    return middlewareList.filter(middleware => {
        for (const policy of middleware.policies) {
            if (condition(middleware, policy)) {
                return true;
            }
        }

        return false;
    });
}

module.exports = async function (instance, loader, router) {
    const { routes } = instance.getComponents();
    
    // Get route middleware and add it by policy types
    const routeMiddleware = Plugins.list(RouteMiddleware);

    const mandatoryMiddleware = routeMiddleware
        .filter(middleware => middleware.type === 'mandatory');
    const omittableMiddleware = routeMiddleware
        .filter(middleware => middleware.type === 'omittable');

    for (const route in routes) {
        const { [route]: Route } = routes;
        const module = new Route();

        if (!Array.isArray(module)) {
            module = [module];
        }

        for (const route of module) {
            const applicableMiddleware = [
                ...matchPolicies(mandatoryMiddleware,
                    (middleware, policy) => route[policy] === middleware.policies[policy]),
                ...matchPolicies(omittableMiddleware,
                    (middleware, policy) => route[policy] !== middleware.policies[policy])
            ];

            // Use a polyfill for Array#sortBy, to avoid using UnderscoreJS
            arraySortBy.add();
            
            const routeMiddleware = applicableMiddleware
                .sortBy('name')
                .sortBy('priority')
                .map(middleware => middleware.action(instance, router, route));
            
            // Removes the polyfill for Array#sortBy
            arraySortBy.delete();

            router = await loader
            .route(instance, router, routeMiddleware, route);
        }
       
    }

    return router;
};
