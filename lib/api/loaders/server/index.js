'use strict';

const { Plugins } = require('@booljs/api');
const PreRoute = require('./preroute');
const Middleware = require('./middleware');
const Router = require('./router');
const PostRoute = require('./postroute');

/**
 * @private
 * @description Boots server using instance data and a server plug-in
 * @param  {Object} _instance - Application's instance
 * @param  {Object} _loader - Server loader plugin
 * @return {Promise}
 */
module.exports = async function (instance, drivers) {
    const loadedServers = [];

    for (const driver of drivers) {
        const serverDriver = Plugins.get(driver);

        let server = await serverDriver.init(instance);
        let router = await PreRoute(instance, serverDriver, server);

        router = await Middleware(instance, serverDriver, router);
        router = await Router(instance, serverDriver, router);
        server = await PostRoute(instance, serverDriver, router, server);

        server = await serverDriver.boot(server);
        loadedServers.push(server);
    }

    return loadedServers.length > 0
        ? loadedServers[0]
        : undefined;
};
