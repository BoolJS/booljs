'use strict';

module.exports = async function (instance, loader, router, server) {
    return loader.postroute(instance, server, router);
};
