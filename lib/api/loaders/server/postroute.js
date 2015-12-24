'use strict';

module.exports = function (_instance, loader, router, server) {
    return loader.postroute(_instance, server, router);
};
