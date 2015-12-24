'use strict';

module.exports = function (_instance, loader, server) {
    return q.resolve(loader.preroute(_instance, server));
};
