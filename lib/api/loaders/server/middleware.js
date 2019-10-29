'use strict';

const { Plugins, Middleware } = require('@booljs/api');

module.exports = async function (instance, driver, router) {
    const middlewarePlugins = Plugins.list(Middleware);

    for (const plugin of middlewarePlugins) {
        const middleware = await plugin.action(instance, router);
        router = await driver.middleware(instance, router, middleware);
    }

    return router;
};
