'use strict';

module.exports = async function (instance, loader, server) {
    return loader.preroute(instance, server);
};
