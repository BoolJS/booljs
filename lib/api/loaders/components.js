'use strict';

module.exports = function (_folders, _instance, done, progress) {

    var async = require('async');

    function wrapComponent(component) {
        var Component = require(component);

        return function () {
            return new Component(_instance.getComponents());
        };
    }

    var foldersList = _.omit(_folders.paths, [ 'configuration', 'models' ])
    ,   each        = q.nbind(async.forEachOfSeries, async);

    return each(foldersList, function (components, type, next) {
        each(_instance.getComponents()[type], function (path, name, next) {
            var _component = wrapComponent(path);

            _instance.insertComponent(
                name, _component, _instance.getComponents()[type]
            );
            next();
        }).then(next);
    });
};
