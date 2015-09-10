'use strict';

module.exports = function (_instance, _loader, done, progress) {
    var loader;
    if(typeof _loader == 'string') {
        loader = require(_loader);
    } else {
        loader = _loader;
    }

    return loader.init(_instance).then(function (server) {
        return loader.middleware(_instance, server);
    }).then(function (server) {
        return loader.router(_instance, server);
    }).then(function (server) {
        return loader.boot(server);
    });
};
