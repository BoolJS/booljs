'use strict';

const { Plugins, Middleware } = require('@booljs/api');

module.exports = async function (instance, driver, router) {
    let middlewarePlugins = Plugins.list(Middleware);

    for (let plugin of middlewarePlugins) {
        let middleware = await plugin.action(instance, router);
        router = await driver.middleware(instance, router, middleware);
    }

    return router;
};
