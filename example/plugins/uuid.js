'use strict';

module.exports = function (app) {
    return function () {
        var uuid = require('node-uuid');

        return uuid.getV1();
    };
};
