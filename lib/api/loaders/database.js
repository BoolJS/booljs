'use strict';
var EventEmitter = require('events').EventEmitter;

module.exports = function DatabaseLoader(_instance, _loader, done, progress) {
    var loader;
    if(typeof _loader == 'string') {
        loader = require(_loader);
    } else {
        loader = _loader;
    }

    return loader.openDatabase(
        _instance.getComponents().configuration.get('database')
    ).then(function () {
        return loader.fetchModels(_instance, _instance.getComponents().models);
    });
};
